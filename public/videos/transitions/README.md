# Room Transition Videos

This directory contains the animated video transitions for each room in Bloomroom.

## Video Requirements

- **Format**: MP4 or WebM (MP4 recommended for better browser compatibility)
- **Duration**: 2-4 seconds per video
- **Resolution**: 1920x1080 (1080p) or higher
- **Aspect Ratio**: 16:9
- **File Size**: Keep under 5MB per video for optimal loading
- **Style**: Soft, calming aesthetic matching Bloomroom's theme

## Required Videos

Place the following video files in this directory:

1. **entry.mp4** - Entry Hall transition
2. **planning.mp4** - Planning Room transition
3. **clear-head.mp4** - Clear My Head room transition
4. **future.mp4** - Future Room transition
5. **care.mp4** - Care Room transition
6. **memory.mp4** - Memory Corner transition

## Fallback Behavior

If a video file is missing or fails to load:
- The system will show a beautiful animated placeholder
- The placeholder includes the room icon, name, and description
- After 2 seconds, the room content will load normally
- No errors will be shown to the user

## Testing

To test your videos:
1. Place video files in this directory
2. Run the development server: `npm run dev`
3. Click "Enter Bloomroom" on the opening screen
4. Click on any room to see the video transition
5. You can skip the video by clicking the "Skip →" button

## Tips

- Keep videos simple and smooth
- Avoid jarring movements or sudden changes
- Consider a "walking into the room" perspective
- Use soft lighting and colors
- Test on different devices and browsers
