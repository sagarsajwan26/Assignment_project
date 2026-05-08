export default function StoryCard({ story }) {
  return (
    <div className="story-card">
      <a href={story.url} target="_blank" rel="noreferrer" className="story-title">
        {story.title}
      </a>
      <div className="story-meta">
        <span>{story.points} pts</span>
        <span>by {story.author}</span>
        <span>{story.postedAt}</span>
      </div>
    </div>
  );
}
