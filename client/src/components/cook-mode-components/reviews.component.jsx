import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Rating } from '@material-ui/lab/';
import { Star } from '@material-ui/icons';
import { Box, Snackbar, SnackbarContent } from '@material-ui/core';
import { ReactComponent as Heart } from '../../assets/heart.svg';
import './reviews.styles.scss';
import { createReview, deleteReview } from '../../services/reviews';
import { UserContext } from '../../contexts/user.context';
import BookmarkModal from '../../components/bookmark-modal/bookmark-modal.component';
import { ThemeContext } from '../../contexts/theme.context';

const Reviews = () => {
  const { theme } = useContext(ThemeContext);

  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [createdReview, setCreatedReview] = useState('');
  const [modal, setModal] = useState(false);
  const [clipboardModal, setClipboardModal] = useState(false);
  const url = `http://tan-wrench.surge.sh/recipes/${id}`;

  let thisInput;
  const handleShare = () => {
    const input = thisInput;
    input.select();
    document.execCommand('copy');
    setClipboardModal(true);
  };

  const [snack, setSnack] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });

  const { open, vertical, horizontal } = snack;
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
    if (user) {
      try {
        const createdReview = await createReview({
          recipe: +id,
          rating,
          user: user._id,
          comment: review,
          fullName: user.fullName
        });
        setRating(0);
        setReview('');
        setHover(-1);
        setCreatedReview(createdReview);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSnack({
        open: true,
        vertical: 'bottom',
        horizontal: 'center'
      });
    }
  };

  const handleAddRecipeClick = () => {
    if (user) {
      setModal(!modal);
    } else {
      setSnack({
        open: true,
        vertical: 'bottom',
        horizontal: 'center'
      });
    }
  };

  const handleSnackClose = () => {
    setSnack({ ...snack, open: false });
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
            precision={0.5}
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
        <button
          style={{ background: theme.loginBtn }}
          onClick={handleClick}
          className='add-review-button'
        >
          SUBMIT REVIEW
        </button>
        <button
          style={{ background: theme.loginBtn }}
          className='add-recipe-button'
          onClick={handleAddRecipeClick}
        >
          ADD TO MY RECIPES
          <Heart className='heart-icon' />
        </button>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleSnackClose}
          key={vertical + horizontal}
          autoHideDuration={3000}
        >
          <SnackbarContent
            style={{ backgroundColor: '#effbfa', color: '#ff9f1c' }}
            message='Please Sign In First!'
          />
        </Snackbar>
        <h2>OR</h2>
        <button
          style={{ background: theme.loginBtn }}
          onClick={handleShare}
          className='share-button'
        >
          SHARE
        </button>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={clipboardModal}
          onClose={() => setClipboardModal(false)}
          autoHideDuration={3000}
        >
          <SnackbarContent
            style={{ backgroundColor: '#effbfa', color: '#ff9f1c' }}
            message='Copied to clipboard!'
          />
        </Snackbar>
      </div>
    );
  }

  return (
    <div style={{ background: theme.snacks }} className='reviews-container'>
      <input
        className='hidden-input'
        ref={(input) => (thisInput = input)}
        value={url}
      />
      {modal && <BookmarkModal setModal={setModal} id={id} />}
      {body}
    </div>
  );
};

export default Reviews;
