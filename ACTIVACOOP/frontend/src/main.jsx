import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/home.css";
import "./styles/events.css";
import "./styles/forms.css";
import "./styles/admin.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(
<React.StrictMode>
   <BrowserRouter> 
    <App /> 
    </BrowserRouter>
</React.StrictMode>
);

