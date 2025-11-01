import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState<"matches" | "predictions" | "leagues">("matches");
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👑 Admin Panel</h2>
        
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveSection("matches")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === "matches"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⚽ Matches
          </button>
          <button
            onClick={() => setActiveSection("predictions")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === "predictions"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🎯 Predictions
          </button>
          <button
            onClick={() => setActiveSection("leagues")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeSection === "leagues"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏆 Leagues
          </button>
        </div>

        {activeSection === "matches" && <MatchesSection />}
        {activeSection === "predictions" && <PredictionsSection />}
        {activeSection === "leagues" && <LeaguesSection />}
      </motion.div>
    </div>
  );
}

function MatchesSection() {
  const matches = useQuery(api.matches.getAllMatches);
  const leagues = useQuery(api.matches.getLeagues);
  const createMatch = useMutation(api.matches.createMatch);
  const updateMatch = useMutation(api.matches.updateMatch);
  const deleteMatch = useMutation(api.matches.deleteMatch);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Id<"matches"> | null>(null);
  
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",
    league: "",
    matchDate: "",
    matchTime: "",
    venue: "",
    homeOdds: "2.00",
    drawOdds: "3.00",
    awayOdds: "2.50",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dateTime = new Date(`${formData.matchDate}T${formData.matchTime}`);
      const matchTimestamp = dateTime.getTime();
      
      if (editingMatch) {
        await updateMatch({
          matchId: editingMatch,
          homeTeam: formData.homeTeam,
          awayTeam: formData.awayTeam,
          league: formData.league,
          matchDate: matchTimestamp,
          venue: formData.venue || undefined,
          homeOdds: parseFloat(formData.homeOdds),
          drawOdds: parseFloat(formData.drawOdds),
          awayOdds: parseFloat(formData.awayOdds),
        });
        toast.success("Match updated successfully!");
        setEditingMatch(null);
      } else {
        await createMatch({
          homeTeam: formData.homeTeam,
          awayTeam: formData.awayTeam,
          league: formData.league,
          matchDate: matchTimestamp,
          venue: formData.venue || undefined,
          homeOdds: parseFloat(formData.homeOdds),
          drawOdds: parseFloat(formData.drawOdds),
          awayOdds: parseFloat(formData.awayOdds),
        });
        toast.success("Match created successfully!");
      }
      
      setFormData({
        homeTeam: "",
        awayTeam: "",
        league: "",
        matchDate: "",
        matchTime: "",
        venue: "",
        homeOdds: "2.00",
        drawOdds: "3.00",
        awayOdds: "2.50",
      });
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save match");
    }
  };

  const handleEdit = (match: any) => {
    const date = new Date(match.matchDate);
    setFormData({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      matchDate: date.toISOString().split('T')[0],
      matchTime: date.toTimeString().slice(0, 5),
      venue: match.venue || "",
      homeOdds: match.odds.home.toString(),
      drawOdds: match.odds.draw.toString(),
      awayOdds: match.odds.away.toString(),
    });
    setEditingMatch(match._id);
    setShowAddForm(true);
  };

  const handleDelete = async (matchId: Id<"matches">) => {
    if (!confirm("Are you sure you want to delete this match?")) return;
    
    try {
      await deleteMatch({ matchId });
      toast.success("Match deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete match");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingMatch(null);
    setFormData({
      homeTeam: "",
      awayTeam: "",
      league: "",
      matchDate: "",
      matchTime: "",
      venue: "",
      homeOdds: "2.00",
      drawOdds: "3.00",
      awayOdds: "2.50",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Match Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add Match"}
        </button>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg space-y-4"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            {editingMatch ? "Edit Match" : "Add New Match"}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Team *
              </label>
              <input
                type="text"
                required
                value={formData.homeTeam}
                onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Manchester United"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Away Team *
              </label>
              <input
                type="text"
                required
                value={formData.awayTeam}
                onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Liverpool"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                League *
              </label>
              <input
                type="text"
                required
                value={formData.league}
                onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Premier League"
                list="leagues-list"
              />
              <datalist id="leagues-list">
                {leagues?.map((league) => (
                  <option key={league._id} value={league.name} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Old Trafford"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Date *
              </label>
              <input
                type="date"
                required
                value={formData.matchDate}
                onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Time *
              </label>
              <input
                type="time"
                required
                value={formData.matchTime}
                onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Odds *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.homeOdds}
                onChange={(e) => setFormData({ ...formData, homeOdds: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Draw Odds *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.drawOdds}
                onChange={(e) => setFormData({ ...formData, drawOdds: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Away Odds *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.awayOdds}
                onChange={(e) => setFormData({ ...formData, awayOdds: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingMatch ? "Update Match" : "Create Match"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {!matches ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No matches found. Add your first match!
          </div>
        ) : (
          matches.map((match) => (
            <motion.div
              key={match._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      match.status === "live" ? "bg-red-100 text-red-800" :
                      match.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {match.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-600">{match.league}</span>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-800">
                    {match.homeTeam} vs {match.awayTeam}
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    📅 {new Date(match.matchDate).toLocaleString()}
                    {match.venue && ` • 📍 ${match.venue}`}
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    Odds: Home {match.odds.home} | Draw {match.odds.draw} | Away {match.odds.away}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(match)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(match._id)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function PredictionsSection() {
  return (
    <div className="text-center py-8 text-gray-500">
      Predictions management coming soon...
    </div>
  );
}

function LeaguesSection() {
  const leagues = useQuery(api.matches.getLeagues);
  const createLeague = useMutation(api.matches.createLeague);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    season: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createLeague(formData);
      toast.success("League created successfully!");
      setFormData({
        name: "",
        country: "",
        season: new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
      });
      setShowAddForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create league");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">League Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {showAddForm ? "Cancel" : "+ Add League"}
        </button>
      </div>

      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-lg space-y-4"
        >
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New League</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                League Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Premier League"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., England"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Season *
              </label>
              <input
                type="text"
                required
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., 2024/2025"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create League
          </button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!leagues ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : leagues.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No leagues found. Add your first league!
          </div>
        ) : (
          leagues.map((league) => (
            <motion.div
              key={league._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-800">{league.name}</h4>
              <p className="text-sm text-gray-600 mt-1">🌍 {league.country}</p>
              <p className="text-sm text-gray-600">📅 {league.season}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
