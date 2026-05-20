import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import ViewNote from "./pages/ViewNote";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Loader from "./components/Loader";

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => setAuthReady(true));
    return () => unsub();
  }, []);

  if (!authReady) return <Loader />;

  return (
    <BrowserRouter>
      <Navbar />

      <main className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/create" element={<CreateNote />} />

          <Route path="/edit/:id" element={<EditNote />} />

          <Route path="/note/:id" element={<ViewNote />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
