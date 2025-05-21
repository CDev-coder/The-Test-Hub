import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null);
        const [dimensions, setDimensions] = useState({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        // Handle window resize
        useEffect(() => {
            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });

                if (game.current) {
                    const scale = game.current.scale;
                    scale.resize(window.innerWidth, window.innerHeight);

                    // Notify scenes about resize
                    EventBus.emit("game-resize", {
                        width: window.innerWidth,
                        height: window.innerHeight,
                    });
                }
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                // Initialize with current dimensions
                if (game.current) {
                    game.current.scale.resize(
                        dimensions.width,
                        dimensions.height
                    );
                }

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    game.current = null;
                }
            };
        }, [ref, dimensions]);

        useEffect(() => {
            const handleSceneReady = (scene_instance: Phaser.Scene) => {
                if (
                    currentActiveScene &&
                    typeof currentActiveScene === "function"
                ) {
                    currentActiveScene(scene_instance);
                }

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: scene_instance });
                } else if (ref) {
                    ref.current = {
                        game: game.current,
                        scene: scene_instance,
                    };
                }

                // Handle initial resize for the scene
                EventBus.emit("game-resize", {
                    width: dimensions.width,
                    height: dimensions.height,
                });
            };

            EventBus.on("current-scene-ready", handleSceneReady);

            return () => {
                EventBus.removeListener(
                    "current-scene-ready",
                    handleSceneReady
                );
            };
        }, [currentActiveScene, ref, dimensions]);

        return (
            <div
                id="game-container"
                style={{
                    width: "100vw",
                    height: "100vh",
                    overflow: "hidden",
                    position: "relative",
                }}
            />
        );
    }
);
