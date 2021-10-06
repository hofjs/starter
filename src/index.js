import { enableHofHmr } from './hmr.js'
import { AppRoot } from "./components/app-root";

// Enable HMR for Hof components
enableHofHmr(AppRoot);

// Enable HMR for all modules referenced from this module (recursive)
if (module.hot)
    module.hot.accept();