import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    sport: '',
    location: '',
    date: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, [filters]);

  const fetchTeams = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.sport) queryParams.append('sport', filters.sport);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.date) queryParams.append('date', filters.date);

      const response = await axios.get(`${API_URL}/teams?${queryParams}`);
      setTeams(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch teams');
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      await axios.post(
        `${API_URL}/teams/${teamId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      navigate(`/teams/${teamId}/payment`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join team');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-600">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sport</label>
            <select
              value={filters.sport}
              onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Sports</option>
              <option value="football">Football</option>
              <option value="cricket">Cricket</option>
              <option value="basketball">Basketball</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Enter location"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
              <div className="mt-2 space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Sport:</span> {team.sport}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {team.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span>{' '}
                  {new Date(team.time).toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Available Slots:</span>{' '}
                  {team.totalSlots - team.filledSlots} of {team.totalSlots}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Price per Slot:</span> ₹{team.pricePerSlot}
                </p>
              </div>
              {user && team.creator !== user.id && (
                <button
                  onClick={() => handleJoinTeam(team._id)}
                  disabled={team.status !== 'open'}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {team.status === 'open' ? 'Join Team' : 'Team Full'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No teams found matching your criteria</h3>
        </div>
      )}
    </div>
  );
} 