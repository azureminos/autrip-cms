import './Card.css';

const Card = (props) => {
	const { name, description, imageUrl, state } = props ? props.package : {};
	return (
    <div className="card">
      <div className="front">
        <img src={imageUrl} alt="Avatar" className="card-image" />
        <div className="container">
          <h3>{name} <span className="price">{state}</span></h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
	);
};

export default Card;
