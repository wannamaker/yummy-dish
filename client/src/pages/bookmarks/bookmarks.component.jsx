import React, { useState, useContext, useEffect } from 'react';
import './bookmarks.styles.scss';
import Tabs from '../../components/tabs/tabs.component';
import Header from '../../components/header/header.component';
import Footer from '../../components/footer/footer.component';
import { Search } from '@material-ui/icons';
import { InputBase, Paper } from '@material-ui/core/';
import { UserContext } from '../../contexts/user.context';
import Data from '../../data/details-1.json';

const Bookmarks = () => {
  const { user } = useContext(UserContext);
  const [localBookmarks, setLocalBookmarks] = useState([]);
  const [input, setInput] = useState('');
  useEffect(() => {
    const stuff = [];
    if (user) {
      user.bookmarks.forEach((item) => {
        const data = Data.find((recipe) => recipe.id === +item.recipe);
        stuff.push(data);
      });
      setLocalBookmarks(stuff);
    }
  }, [user]);

  const handleChange = (e) => {
    const { value } = e.target;
    setInput(value);
    const stuff = [];
    user.bookmarks.forEach((item) => stuff.push(+item.recipe));
    const filteredData = Data.filter((data) => stuff.includes(data.id));
    setLocalBookmarks(
      filteredData.filter((data) => data.title.toLowerCase().includes(value))
    );
    console.log(
      filteredData.filter((data) => data.title.toLowerCase().includes(value))
    );
  };
  return (
    <div className='bookmark-page'>
      <Header style={{ backgroundColor: '#fec368' }}>
        My Recipes
        <div className='search-bar'>
          <Paper component='form' className='search-wrapper'>
            <Search
              style={{
                color: '#ff9f1c',
                padding: '5px 10px',
                alignSelf: 'center'
              }}
            />
            <InputBase
              onChange={handleChange}
              value={input}
              placeholder='Search in your recipes'
              style={{
                padding: '5px',
                backgroundColor: '#fff'
              }}
            />
          </Paper>
        </div>
      </Header>
      {user &&
        user.categories.map((category) => (
          <Tabs bookmarks={localBookmarks}>{category}</Tabs>
        ))}
      <Footer />
    </div>
  );
};

export default Bookmarks;
