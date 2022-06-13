// In case an infinite recursing embeddable Studio loop happens it's important ot protect
// against accidental singularities
import { timeline, stagger } from 'motion'
import { Portal } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import styled from 'styled-components'

const StyledIframe = styled.iframe`
  position: absolute;
  height: 200vmin;
  width: 200vmin;
  top: -50vmin;
  opacity: 0.5;
  padding-inline: calc(calc(100vmax - 100vmin) / 2);
  mix-blend-mode: difference;
  left: -50vmin;
  transform: scale(0);
  transition: ease-out 30s;
  transition-property: opacity, transform;
  transform-origin: 75% center;
  mask-image: radial-gradient(circle at 50% 50%, #000 50%, #0000 60%);
  box-sizing: content-box;
  border: 0 #0000 solid;
  pointer-events: none;
  z-index: 1000;

  &[data-open] {
    opacity: 0.7;
    transform: scale(1);
    transform-origin: 50% center;
  }
`

// const url = new URL('/eh/index.html?oi=1185&bhm=257&sfr=497', 'http://localhost:3000')
// const url = new URL('/eh/index.html?oi=1268&bhm=271&sfr=497&cb=210&dt=419&ce=412&sfy=976&do=255&dd=442&ct=1', 'http://localhost:3000')
const url = new URL(
  '/eh/index.html?oi=1416&bhm=259&sfr=1475&cb=210&dt=419&ce=412&sfy=3600&do=255&dd=442&ct=1&sfe=0&sfp=645&hc=1',
  'http://localhost:3000'
)

// ix-blend-mode: hard-light; is fun or color-dodge
export default function Singularity(props: { singularity: boolean }) {
  const [singularity, setSingularity] = useState(props.singularity)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    unstable_batchedUpdates(() => {
      setSingularity(props.singularity)
    })
  }, [props.singularity])
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // @ts-expect-error
      window.forceSingularity = () => setSingularity(true)
    }
    if ('requestIdleCallback' in window) {
      const cb = requestIdleCallback(() => setOpen(singularity))
      return () => cancelIdleCallback(cb)
    }
    const timeout = setTimeout(() => setOpen(singularity), 2000)
    return () => clearTimeout(timeout)
  }, [singularity])
  useEffect(() => {
    if (open) {
      document.body.style.background = '#000'

      timeline(
        [
          [
            '#user-menu,#global-presence-menu',
            {
              transform: [
                'translate3d(-1px, 0, 0)',
                ' translate3d(2px, 0, 0)',
                'translate3d(-4px, 0, 0)',
                ' translate3d(4px, 0, 0)',
                ' translate3d(-5px, 0, 0)',
                ' translate3d(6px, 0, 0)',
                ' translate3d(7px, 0, 0)',
                ' translate3d(6px, 0, 0)',
                ' translate3d(-5px, 0, 0)',
                ' translate3d(4px, 0, 0)',
                'translate3d(-4px, 0, 0)',
                ' translate3d(2px, 0, 0)',
                'translate3d(-1px, 0, 0)',
              ],
            },
            {
              delay: stagger(0.1),
            },
          ],
          [
            '#user-menu,#global-presence-menu',
            {
              transform: 'translate3d(-50vw,50vh, 0) scale(0)',
            },
            { delay: stagger(0.1) },
          ],
          [
            '[data-studio-preview] [data-studio-preview] [data-studio-preview] [data-studio-preview] [data-studio-preview] [data-studio-preview]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
          [
            '[data-studio-preview] [data-studio-preview] [data-studio-preview] [data-studio-preview] [data-studio-preview]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
          [
            '[data-studio-preview] [data-studio-preview] [data-studio-preview] [data-studio-preview]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
          [
            '[data-studio-preview] [data-studio-preview] [data-studio-preview]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
          [
            '[data-studio-preview] [data-studio-preview]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
          [
            '[data-studio-preview]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
          [
            '[data-studio-canvas]',
            {
              opacity: 0,
              transform: 'translate3d(-5vw,5vh, 0) scale(0.5) rotate(15deg)',
            },
          ],
        ],
        { delay: 10, defaultOptions: { easing: 'ease-in-out' } }
      )
    }
  })

  if (!singularity) return null

  return (
    <Portal>
      <StyledIframe
        src={`${url.pathname}${url.search}`}
        data-open={open ? true : undefined}
        // @ts-expect-error
        allowtransparency
      />
    </Portal>
  )
}
