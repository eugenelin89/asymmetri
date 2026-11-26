// The page and release manifest pin the compiled player to one game revision.
export type CourtPlayer = {
  SendMessage: (object: string, method: string, argument?: number) => void;
  Quit: () => Promise<void>;
};

type PlayerFiles = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl: string;
};
type PlayerConfig = PlayerFiles & {
  companyName: string;
  productName: string;
  productVersion: string;
  devicePixelRatio: number;
  cacheControl: (url: string) => "immutable" | "must-revalidate";
  showBanner: (message: string, type: string) => void;
  errorHandler: (message: string) => boolean;
};

declare global {
  interface Window {
    createUnityInstance?: (
      canvas: HTMLCanvasElement, config: PlayerConfig, progress: (fraction: number) => void
    ) => Promise<CourtPlayer>;
  }
}

function insertLoader(url: string, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal.throwIfAborted();
    const script = document.createElement("script");
    const done = (error?: Error) => {
      signal.removeEventListener("abort", abort);
      script.remove();
      if (error) reject(error);
      else resolve();
    };
    const abort = () => done(new DOMException("Court closed", "AbortError"));
    script.onload = () => done();
    script.onerror = () => done(new Error("The game loader could not be downloaded."));
    script.src = url;
    signal.addEventListener("abort", abort, { once: true });
    document.head.append(script);
  });
}

export async function loadCourt(
  manifestUrl: string, canvas: HTMLCanvasElement, signal: AbortSignal,
  onProgress: (fraction: number) => void, onRuntimeError: () => void
) {
  const response = await fetch(manifestUrl, { signal });
  if (!response.ok) throw new Error("The game manifest is unavailable.");
  const manifest = await response.json();
  const folder = manifestUrl.slice(0, manifestUrl.lastIndexOf("/") + 1);
  const assets = ["loaderUrl", "dataUrl", "frameworkUrl", "codeUrl", "streamingAssetsUrl"] as const;
  if (typeof manifest.sourceRevision !== "string" || !folder.endsWith("/" + manifest.sourceRevision + "/") ||
      !assets.every((key) => typeof manifest[key] === "string" &&
        manifest[key].startsWith(folder) && new URL(manifest[key], location.origin).pathname.startsWith(folder))) {
    throw new Error("The game release is incomplete.");
  }
  await insertLoader(manifest.loaderUrl, signal);
  signal.throwIfAborted();
  if (!window.createUnityInstance) throw new Error("The game loader did not start.");
  return window.createUnityInstance(canvas, {
    dataUrl: manifest.dataUrl, frameworkUrl: manifest.frameworkUrl, codeUrl: manifest.codeUrl,
    streamingAssetsUrl: manifest.streamingAssetsUrl,
    companyName: "Asymmetri", productName: "Court Damage", productVersion: manifest.sourceRevision,
    cacheControl(url) {
      const asset = new URL(url, location.origin);
      return asset.origin === location.origin && asset.pathname.startsWith(folder) ? "immutable" : "must-revalidate";
    },
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    errorHandler(message) {
      console.error(message);
      onRuntimeError();
      return true;
    },
    showBanner(message, type) {
      if (type === "error") { console.error(message); onRuntimeError(); }
      else if (type === "warning") console.warn(message);
    },
  }, onProgress);
}
