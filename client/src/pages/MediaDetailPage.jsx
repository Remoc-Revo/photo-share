import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Comments from '../components/comments/Comments';
import Rating from '../components/ratings/Rating';

const fetchMediaDetails = async (id) => {
    const { data } = await axios.get(`/api/media/${id}`);
    return data;
};

const MediaDetailPage = () => {
    const { id } = useParams();
    const { data: media, error, isLoading } = useQuery({
        queryKey: ['media', id],
        queryFn: () => fetchMediaDetails(id)
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error occurred: {error.message}</div>;
    if (!media) return <div>Media not found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img src={media.blob_url} alt={media.title} className="w-full object-cover" style={{ maxHeight: '70vh' }} />
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{media.title}</h1>
                    <p className="text-gray-600 mb-4">by {media.creator_name}</p>
                    {media.caption && <p className="text-gray-800 my-4">{media.caption}</p>}
                    {media.location && <p className="text-gray-500 text-sm">Location: {media.location}</p>}
                    
                    <div className="my-4 flex items-center justify-between">
                        <div>
                            <span className="text-yellow-500 text-2xl">⭐</span>
                            <span className="ml-2 text-xl">{parseFloat(media.average_rating || 0).toFixed(1)}</span>
                        </div>
                        <Rating mediaId={id} />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Comments mediaId={id} />
            </div>
        </div>
    );
};

export default MediaDetailPage;
