import { useEffect, useState } from "react";
import { Trash2, Phone, Mail, User, Plus, Search, AlertCircle } from "lucide-react";

const API_URL = "https://contactflow-4s5u.onrender.com/api/contacts";

function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Validation Logic
  const isEmailValid = /^\S+@\S+\.\S+$/.test(form.email);
  const isFormValid = form.name.trim() !== "" && isEmailValid && form.phone.length >= 10;

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Server not reachable");
      const data = await res.json();
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Backend is offline. Please run 'node server.js'");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addContact = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ name: "", email: "", phone: "" });
        fetchContacts();
      }
    } catch (err) {
      alert("Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchContacts();
  };

  // Search Filter
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
// Change your opening div to this:
<div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 flex flex-col">      
      {/* Navbar - Full Width */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 w-full">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">C</div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Contact<span className="text-indigo-600">Flow</span></h1>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <AlertCircle className="w-3 h-3" /> {error}
                </div>
              )}
              <div className="text-sm text-slate-500 font-medium hidden sm:block">MERN Task</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full Width */}
      <main className="w-full px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form (Fixed Width on Large Screens) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">New Contact</h2>
                <p className="text-slate-500 text-xs mt-1">Add a new person to your list.</p>
              </div>

              <form onSubmit={addContact} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:bg-white focus:border-transparent transition-all outline-none ${form.email && !isEmailValid ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500'}`}
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">Phone</label>
                  <div className="relative group">
                    <Phone className="w-4 h-4 absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all outline-none"
                      placeholder="123-456-7890"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2 mt-2
                    ${isFormValid ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                >
                  {loading ? <span className="animate-pulse">Saving...</span> : <><Plus className="w-4 h-4" /> Add Contact</>}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: List (Expands to Fill) */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Contacts 
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{contacts.length}</span>
              </h2>
              <div className="relative group w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search contacts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredContacts.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No contacts found</h3>
                  <p className="text-slate-500 text-sm mt-1">Start by adding a new contact on the left.</p>
                </div>
              ) : (
                filteredContacts.map((c) => (
                  <div key={c._id} className="group bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 relative flex flex-col justify-between h-full">
                    
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-white text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-50 shadow-inner">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Contact</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => deleteContact(c._id, e)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate font-medium">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{c.phone}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;