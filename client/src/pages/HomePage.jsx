import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const fetchPublicMedia = async () => {
    const { data } = await axios.get('/api/media');
    return data;
};

const HomePage = () => {
    const { data: media, error, isLoading } = useQuery({
        queryKey: ['publicMedia'],
        queryFn: fetchPublicMedia
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Public Gallery</h1>
            {media && media.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {media.map((item) => (
                        <Link to={`/media/${item.id}`} key={item.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <img src={item.thumbnail_blob_url || item.blob_url || 'https://via.placeholder.com/200'} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                                <p className="text-gray-600 text-sm">by {item.creator_name}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="ml-1">{parseFloat(item.average_rating || 0).toFixed(1)}</span>
                                    <span className="ml-4">💬 {item.comment_count}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">There are no photos in the gallery yet.</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
