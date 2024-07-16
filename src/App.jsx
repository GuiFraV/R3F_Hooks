import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { button, useControls } from "leva";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ThemeProvider, useTheme } from "./hooks/useTheme";

const UI = () => {
  const { setColor } = useTheme();
  useControls({
    changeColorToRed: button(() => setColor("red")),
    changeColorToGreen: button(() => setColor("green")),
    changeColorToBlue: button(() => setColor("blue")),
  });
};
const Cube = memo((props) => {
  console.log("Cube rendered");

  const { color } = useTheme();
  const ref = useRef();

  const material = useMemo(
    () => <meshStandardMaterial color={color} />,
    [color]
  );

  useControls({
    rotateCube: button(() => (ref.current.rotation.y += Math.PI / 4)),
  });

  useEffect(() => {
    const colorsPosition = {
      white: [0, 0, 0],
      red: [-1, 0, 0],
      green: [1, 0, 0],
      blue: [0, 1, 0],
    };
    const position = colorsPosition[color];
    ref.current.position.set(...position);

    const interval = setInterval(
      () => (ref.current.rotation.y += Math.PI / 4),
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [color]);

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry />
      {material}
    </mesh>
  );
});

function App() {
  const [count, setCount] = useState(0);
  const onCubeClicked = useCallback(() => {
    console.log(`Cube clicked ${count} time${count > 1 ? "s" : ""}`);
    setCount((prev) => prev + 1);
  }, [count]);
  return (
    <>
      <ThemeProvider>
        <UI />
        <Canvas camera={{ position: [0, 2, 6], fov: 42 }}>
          <OrbitControls />
          <Cube rotation-y={Math.PI / 4} onClick={onCubeClicked} />
          <ContactShadows
            position-y={-2}
            opacity={0.5}
            blur={2}
            color={"pink"}
            scale={10}
          />
          <Environment preset="city" />
        </Canvas>
      </ThemeProvider>
    </>
  );
}

export default App;
