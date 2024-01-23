import { useCallback, useEffect } from "react";
import Particles from "react-tsparticles";  // Corregido aquí
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

export function ParticlesContainer(props: unknown) {
  // this customizes the component tsParticles installation
  const customInit = useCallback(async (engine: Engine) => {
    // this adds the bundle to tsParticles
    await loadFull(engine);
  }, []);  // Agregado aquí una dependencia vacía

  const options = {
    background: {
    //   color: "#0d47a1",
    },
    interactivity: {
      events: {
        // onClick: {
        //   enable: true,
        //   mode: "push",
        // },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40,
        },
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 40,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#90e0ef",
      },
      links: {
        color: "#000000",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: {
        enable: false,
      },
      move: {
        direction: "none",
        enable: true,
        outMode: "bounce",
        random: false,
        speed: 4,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          value_area: 800,
        },
        value: 120,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        random: true,
        value: 5,
      },
    },
  };

  useEffect(() => {
    const canvasElement = document.querySelector("#tsparticles > canvas");
    if (canvasElement) {
      canvasElement.style.position = 'absolute';
      canvasElement.style.top = '0';
      canvasElement.style.left = '0';
      canvasElement.style.borderRadius = '15px';
    }
  }, []);

  return <Particles options={options} init={customInit} />;
            
           
    
   
      // Corregido aquí
}