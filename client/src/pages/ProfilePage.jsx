import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This is a placeholder. A real implementation would require a dedicated backend endpoint.
// For now, we filter the public media on the client side, which is not ideal.
const fetchUserMedia = async (userId) => {
    // In a real app: await axios.get(`/api/users/${userId}/media`);
    const { data } = await axios.get('/api/media'); 
    return data.filter(item => item.user_id === parseInt(userId));
};


const ProfilePage = () => {
    const { userId } = useParams();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { data: media, error, isLoading } = useQuery({
        queryKey: ['userMedia', userId],
        queryFn: () => fetchUserMedia(userId)
    });

    // Placeholder for user data
    const username = media && media.length > 0 ? media[0].creator_name : 'User';
    const isOwnProfile = user && user.id === parseInt(userId);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <div>
            <div className="p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold">{username}'s Profile</h1>
                {isOwnProfile && (
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Logout
                    </button>
                )}
            </div>
            <h2 className="text-2xl font-bold mb-4">Uploaded Media</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {media && media.length > 0 ? media.map((item) => (
                    <Link to={`/media/${item.id}`} key={item.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <img src={item.thumbnail_url || 'https://via.placeholder.com/200'} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                        </div>
                    </Link>
                )) : (
                    <p>This user has not uploaded any media.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
