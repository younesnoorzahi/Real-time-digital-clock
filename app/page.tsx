"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, Timer, RefreshCw, Play, Pause, Square } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timerDuration, setTimerDuration] = useState(0)
  const [timerRemaining, setTimerRemaining] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const { toast } = useToast()

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setIsTimerRunning(false)
            playAlarmSound()
            toast({
              title: "Timer Complete!",
              description: "Your timer has finished.",
              variant: "default",
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTimerRunning, timerRemaining, toast])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTimerDisplay = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const startTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTimerDuration(totalSeconds)
      setTimerRemaining(totalSeconds)
      setIsTimerRunning(true)
    } else {
      toast({
        title: "Invalid Time",
        description: "Please set a time greater than zero.",
        variant: "destructive",
      })
    }
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerRemaining(0)
    setHours(0)
    setMinutes(0)
    setSeconds(0)
  }

  const playAlarmSound = () => {
    const audio = new Audio("/alarm.mp3")
    audio.play().catch((e) => console.error("Error playing sound:", e))
  }

  const timerProgress = timerDuration > 0 ? ((timerDuration - timerRemaining) / timerDuration) * 100 : 0

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">Digital Clock & Timer</h1>

        <Tabs defaultValue="clock" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="clock" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Clock
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Timer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clock">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Current Time</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentTime(new Date())}
                    aria-label="Refresh time"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-6xl font-bold tracking-wider text-primary">{formatTime(currentTime)}</div>
                  <div className="text-xl text-gray-500 dark:text-gray-400">{formatDate(currentTime)}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timer">
            <Card>
              <CardHeader>
                <CardTitle>Timer</CardTitle>
              </CardHeader>
              <CardContent>
                {!isTimerRunning && timerRemaining === 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Hours</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="0"
                          max="23"
                          value={hours}
                          onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minutes">Minutes</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seconds">Seconds</Label>
                        <Input
                          id="seconds"
                          type="number"
                          min="0"
                          max="59"
                          value={seconds}
                          onChange={(e) => setSeconds(Number.parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <Button className="w-full" onClick={startTimer} aria-label="Start timer">
                      <Play className="h-4 w-4 mr-2" />
                      Start Timer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center">
                      <div className="text-6xl font-bold tracking-wider text-primary mb-4">
                        {formatTimerDisplay(timerRemaining)}
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                        <div
                          className="bg-primary h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${timerProgress}%` }}
                          role="progressbar"
                          aria-valuenow={timerProgress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>

                      <div className="flex space-x-4">
                        {isTimerRunning ? (
                          <Button variant="outline" onClick={pauseTimer} aria-label="Pause timer">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button variant="outline" onClick={startTimer} aria-label="Resume timer">
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                        <Button variant="destructive" onClick={resetTimer} aria-label="Reset timer">
                          <Square className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
