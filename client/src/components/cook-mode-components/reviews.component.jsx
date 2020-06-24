import React, { useState, useContext, useEffect } from 'react';
import { Rating } from '@material-ui/lab/';
import { Star } from '@material-ui/icons';
import { Box } from '@material-ui/core';
import { ReactComponent as Heart } from '../../assets/heart.svg';
import './reviews.styles.scss';
import { createReview, deleteReview } from '../../services/reviews';
import { UserContext } from '../../contexts/user.context';
import { useParams } from 'react-router-dom';

const Reviews = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [createdReview, setCreatedReview] = useState('');

  const labels = {
    0.5: '💩',
    1: '🤮',
    1.5: '🤢',
    2: '🤬',
    2.5: '👎',
    3: '😐',
    3.5: '👌',
    4: '👍',
    4.5: '😋',
    5: '😍'
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setReview(value);
  };

  const handleRatingChange = (e, newRating) => {
    setRating(newRating);
  };

  const handleHoverChange = (e, newHover) => {
    setHover(newHover);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const createdReview = await createReview({
        recipe: +id,
        rating,
        user: user._id,
        comment: review
      });
      setRating(0);
      setReview('');
      setHover(-1);
      setCreatedReview(createdReview);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReviewDelete = async (e) => {
    e.preventDefault();
    try {
      const deletedReview = await deleteReview(createdReview.data._id);
      if (deletedReview) setCreatedReview('');
    } catch (err) {
      console.log(err);
    }
  };

  let body;
  if (createdReview) {
    const { comment, rating } = createdReview.data;
    body = (
      <div className='content-container'>
        <h1>Your Review</h1>
        <div className='rating-bar'>
          <Rating
            name='half-rating-read'
            value={rating}
            emptyIcon={<Star style={{ color: '#fff' }} />}
            readOnly
          />
        </div>
        <p className='comment'>{comment}</p>

        <button onClick={handleReviewDelete} className='delete-review-button'>
          DELETE REVIEW
        </button>
      </div>
    );
  } else {
    body = (
      <div className='content-container'>
        <h1>REVIEW</h1>
        <p>How did it go?</p>
        <div className='rating-bar'>
          <Rating
            size='medium'
            onChange={handleRatingChange}
            onChangeActive={handleHoverChange}
            className='Rating'
            name='half-rating'
            defaultValue={0}
            precision={0.5}
            emptyIcon={<Star style={{ color: '#fff' }} />}
          />
          {rating !== null && (
            <Box ml={2}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </div>
        <textarea
          type='reset'
          name='review-input'
          value={review}
          onChange={handleInputChange}
          placeholder='Write A Review...'
          rows='2'
        />
        <button onClick={handleClick} className='add-review-button'>
          SUBMIT REVIEW
        </button>
        <button className='add-recipe-button'>
          ADD TO MY RECIPES
          <Heart className='heart-icon' />
        </button>
        <h2>OR</h2>
        <button className='share-button'>SHARE</button>
      </div>
    );
  }
  return <div className='reviews-container'>{body}</div>;
};

export default Reviews;