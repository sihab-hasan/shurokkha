import { execFileSync, execSync } from "node:child_process"

const ports = [3000, 3003]
const stopped = new Set()

function stopPid(pid, port) {
  if (!pid || stopped.has(pid)) return

  try {
    if (process.platform === "win32") {
      execFileSync("taskkill", ["/PID", String(pid), "/F"], { stdio: "ignore" })
    } else {
      process.kill(Number(pid), "SIGTERM")
    }
    stopped.add(pid)
    console.log(`Stopped process ${pid} on port ${port}.`)
  } catch {
    // The process may have exited between discovery and termination.
  }
}

if (process.platform === "win32") {
  const output = execSync("netstat -ano -p tcp", { encoding: "utf8" })
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(
      /^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i
    )
    if (!match) continue
    const port = Number(match[1])
    if (ports.includes(port)) stopPid(Number(match[2]), port)
  }
} else {
  for (const port of ports) {
    let pids = []
    try {
      const output = execFileSync(
        "lsof",
        ["-ti", `tcp:${port}`, "-sTCP:LISTEN"],
        {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }
      )
      pids = output.split(/\s+/).filter(Boolean)
    } catch {
      try {
        const output = execFileSync("fuser", [`${port}/tcp`], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        })
        pids = output.match(/\d+/g) ?? []
      } catch {
        // No listener, or neither utility is available.
      }
    }
    for (const pid of pids) stopPid(Number(pid), port)
  }
}

if (!stopped.size)
  console.log("No dev servers were listening on ports 3000 or 3003.")
