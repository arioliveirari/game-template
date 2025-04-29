// Importa los módulos necesarios
import Head from 'next/head'
import React from 'react'
import Phaser from 'phaser'
import Game from '@/game'

declare global {
  interface Window { Phaser: typeof Phaser }
}

export default function Level() {
  const [_phaser, setPhaser] = React.useState<typeof Phaser>()
  const [GameConstructor, setGameConstructor] = React.useState<Game>()
  const [game, setGame] = React.useState<Phaser.Game>();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [maps, setMaps] = React.useState<string[]>();

  const [orientation,setOrientation] = React.useState<String | null>(null)

  const handleOrientationChange = () => {
    setTimeout(() => {

      if (window.innerHeight > window.innerWidth) {
          setOrientation('portrait')
      } else {
          setOrientation('landscape')
      }
    }, 1000)
  }
 
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      handleOrientationChange()
      //@ts-ignore
      window.addEventListener('orientationchange', handleOrientationChange.bind(this))
      //@ts-ignore
      return () => window.removeEventListener('orientationchange', handleOrientationChange.bind(this))
    }
  }, []) 

  React.useEffect(() => {
    if (!game && orientation == "landscape") { 
      const DynamicPhaser = require('phaser')
      setPhaser(DynamicPhaser)
      setMaps([])
    }
  }, [orientation])

  // Efecto para inicializar el juego cuando se cargan los mapas
  React.useEffect(() => {
    if (canvasRef.current && maps) {
      const DynamicGame = require('@/game')
      const G = DynamicGame.default as typeof Game
      setGameConstructor(new G(canvasRef.current, maps))
    }
  }, [canvasRef, maps])

  // Efecto para iniciar el juego cuando Phaser y GameConstructor están disponibles
  React.useEffect(() => {
    if (_phaser && canvasRef.current && GameConstructor) {
      const game = GameConstructor.init();
      setGame(game)
    } 
  }, [_phaser, GameConstructor])

  return (
    <>
      <Head>
        <title>Game test</title>
        <meta name="description" content={``} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon2.png" />
        {/* <link rel="manifest" href="manifest.json" /> */}

      </Head>
      <main>
      {orientation == "portrait" && <div className="orientation-message">
        <h1>Por favor gira tu dispositivo</h1>
      </div>}
        <div className="game-container">
          <canvas ref={canvasRef} />
        </div>
      </main>
    </>
  )
}
