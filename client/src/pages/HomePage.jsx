import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegComment, FaStar, FaUserCircle, FaImage } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const fetchPublicMedia = async () => {
    const { data } = await axios.get('/api/media');
    return data;
};

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: media, error, isLoading } = useQuery({
        queryKey: ['publicMedia'],
        queryFn: fetchPublicMedia
    });

    if (error) return <div className="p-4">An error occurred: {error.message}</div>;

    return (
        <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-bold">Feeds</h1>
            </div>

            {/* Sleek "Create Post" UI */}
            {user && user.role == 'creator' && ( // Only show if user is logged in AND is a creator
                <div className="p-4 border-b border-gray-200 dark:border-gray-700" onClick={() => navigate('/upload')}>
                    <div className="flex items-start space-x-4">
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                        <div className="flex-1">
                            <div className="w-full bg-transparent text-lg text-gray-500 cursor-pointer" >
                                Caption
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <FaImage className="text-blue-500 text-xl cursor-pointer hover:text-blue-400" />
                                <button disabled className="px-4 py-1.5 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 disabled:bg-blue-300">
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="p-4 text-center">Loading feed...</div>
            ) : media && media.length > 0 ? (
                <div>
                    {media.map((item) => (
                        <div key={item.id} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                            <Link to={`/profile/${item.user_id}`} className="font-bold hover:underline">{item.creator_name}</Link>
                            <Link to={`/media/${item.id}`}>
                                <p className="my-1">{item.title}</p>
                                <img src={item.thumbnail_blob_url || item.blob_url} alt={item.title} className="mt-2 rounded-2xl border border-gray-200 dark:border-gray-700 w-full object-cover" />
                            </Link>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-8 mt-3">
                                <div className="flex items-center space-x-2 hover:text-blue-500"><FaRegComment /> <span>{item.comment_count || 0}</span></div>
                                <div className="flex items-center space-x-2 hover:text-yellow-500"><FaStar /> <span>{parseFloat(item.average_rating || 0).toFixed(1)}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10">
                    <p className="text-gray-500 dark:text-gray-400">The gallery is empty.</p>
                </div>
            )}
        </>
    );
};

export default HomePage;
