"use client"
import { useState, useEffect } from "react"
import { Search, Filter, Bell, Calendar, MapPin, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for football matches (as it would come from your API)


export default function FootballMatches() {
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLeague, setSelectedLeague] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate API call - replace this with your actual API call
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      try {
        // Replace this with your actual API endpoint
        const response = await fetch('http://localhost:3001/upcoming')

        const data = await response.json()
        const formatted = data.map((match, index) => ({
        id: index + 1,
        homeTeam: match.home,
        awayTeam: match.away,
        date: match.date.split("T")[0],
        time: match.date.split("T")[1].slice(0, 5), // Extract HH:MM
        venue: "TBD", // API doesn't provide venue; you can update this later
        league: "Brasileirão", // Hardcoded for now since only BSA used
        status: "upcoming",
      }))
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setMatches(formatted)
        setFilteredMatches(formatted)
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  // Filter matches based on search and league selection
  useEffect(() => {
    let filtered = matches

    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.venue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedLeague !== "all") {
      filtered = filtered.filter((match) => match.league === selectedLeague)
    }

    setFilteredMatches(filtered)
  }, [searchTerm, selectedLeague, matches])

  const handleNotificationToggle = (matchId) => {
    setNotifications((prev) => {
      if (prev.includes(matchId)) {
        return prev.filter((id) => id !== matchId)
      } else {
        return [...prev, matchId]
      }
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const leagues = [...new Set(matches.map((match) => match.league))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-emerald-200 text-lg">Loading matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-emerald-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-4xl">🏆</div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Football Matches
              </h1>
              <div className="text-4xl">🏆</div>
            </div>
            <p className="text-emerald-200">Stay updated with upcoming matches</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
              <Input
                placeholder="Search teams or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-emerald-500/30 text-white placeholder-emerald-300 focus:border-emerald-400"
              />
            </div>

            <div className="relative">
              <Select value={selectedLeague} onValueChange={setSelectedLeague}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-700/50 border-cyan-500/30 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by league" />
                </SelectTrigger>
                <SelectContent
                  className="bg-slate-800 border-cyan-500/30 animate-in slide-in-from-top-2 duration-200"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <SelectItem value="all" className="text-white hover:bg-cyan-600/20">
                    All Leagues
                  </SelectItem>
                  {leagues.map((league) => (
                    <SelectItem key={league} value={league} className="text-white hover:bg-cyan-600/20">
                      {league}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No matches found</h3>
            <p className="text-emerald-200">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <Card
                key={match.id}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden border border-transparent hover:border-emerald-400/40"
              >

                <CardHeader>
                  <div className="flex justify-between items-start ">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 
                      my-1 'text-emerald-200 border border-emerald-500/30"
                    >
                      {match.league}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleNotificationToggle(match.id)
                      }}
                      className={`p-2 ${
                        notifications.includes(match.id)
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-cyan-400 hover:text-cyan-300"
                      }`}
                    >
                      <Bell className={`h-4 w-4 ${notifications.includes(match.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Teams */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                        ⚽
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{match.homeTeam}</p>
                        <p className="text-emerald-200 text-sm">Home</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm px-3 py-1 rounded-full mx-4">
                      VS
                    </div>

                    <div className="flex items-center space-x-2 flex-1 justify-end">
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-white font-semibold truncate">{match.awayTeam}</p>
                        <p className="text-cyan-200 text-sm">Away</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                        ⚽
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="space-y-3 pt-4 border-t border-emerald-500/20">

                    <div className="flex items-center text-slate-200">
                      <Calendar className="h-4 w-4 mr-3 text-emerald-400" />
                      <span className="text-sm">{formatDate(match.date)}</span>
                    </div>

                    <div className="flex items-center text-slate-200">
                      <Clock className="h-4 w-4 mr-3 text-cyan-400" />
                      <span className="text-sm">{match.time}</span>
                    </div>

                    <div className="flex items-center text-slate-200">
                      <MapPin className="h-4 w-4 mr-3 text-purple-400" />
                      <span className="text-sm truncate">{match.venue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-6 bg-slate-800/40 backdrop-blur-sm rounded-lg px-6 py-4 border border-emerald-500/20">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {filteredMatches.length}
              </div>
              <div className="text-emerald-200 text-sm">Matches</div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-emerald-500/30 to-cyan-500/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {leagues.length}
              </div>
              <div className="text-cyan-200 text-sm">Leagues</div>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-cyan-500/30 to-blue-500/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {notifications.length}
              </div>
              <div className="text-blue-200 text-sm">Notifications</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
