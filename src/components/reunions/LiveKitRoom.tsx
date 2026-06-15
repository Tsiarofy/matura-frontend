import React, { Component, ErrorInfo, ReactNode } from 'react'
import { LiveKitRoom, VideoConference, useParticipants } from '@livekit/components-react'
import '@livekit/components-styles'
import { Users, AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  token:   string
  wsUrl:   string
  onLeave?: () => void
}

export function MaturaLiveKitRoom({ token, wsUrl, onLeave }: Props) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={wsUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={onLeave}
      data-lk-theme="default"
      style={{ height: '100vh', width: '100vw' }}
    >
      <MaturaLiveKitRoomContent />
    </LiveKitRoom>
  )
}

function MaturaLiveKitRoomContent() {
  const participants = useParticipants()
  const participantCount = participants.length

  return (
    <div className="relative w-screen h-screen bg-zinc-950">
      {/* Premium Floating Header */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2.5 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 px-3.5 py-1.5 rounded-full shadow-lg text-zinc-300">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-semibold tracking-wider uppercase text-zinc-200">Matura Meet</span>
        <div className="h-3 w-px bg-zinc-700" />
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Users className="w-3.5 h-3.5" />
          <span>{participantCount} {participantCount > 1 ? 'participants' : 'participant'}</span>
        </div>
      </div>

      {/* Waiting banner when alone in the room */}
      <div 
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 px-4 py-2 rounded-full shadow-lg pointer-events-none transition-all duration-300 ${
          participantCount === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium text-zinc-300">
          Salle active — En attente du second participant...
        </span>
      </div>

      {/* Video Grid / Controls from LiveKit inside a Safe Error Boundary */}
      <div className="w-full h-full">
        <SafeErrorBoundary>
          <VideoConference />
        </SafeErrorBoundary>
      </div>
    </div>
  )
}

// ─── SAFE ERROR BOUNDARY ─────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class SafeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary a intercepté une erreur de rendu vidéo :", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-zinc-950 p-6 text-center text-white gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 animate-bounce">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-semibold text-zinc-200">Incident d'affichage du flux vidéo</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Le rendu des caméras a rencontré un problème d'insertion DOM temporaire. Vous pouvez recharger l'affichage sans quitter l'appel.
            </p>
          </div>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-medium transition-all shadow-md shadow-blue-900/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Réactiver l'affichage
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
