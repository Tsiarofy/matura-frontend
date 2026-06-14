import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react'
import '@livekit/components-styles'

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
      style={{ height: '100vh' }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
