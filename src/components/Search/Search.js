//import axios from 'axios';
import axios from 'axios';
import { Component } from 'react';

class Search extends Component {
  state = {
    apiURL: 'https://pixabay.com/api/',
    apiKey: '38646134-f0d35baa377bc06e37b81532c',
    page: 1,
    q: '',
    per_page: 12,
    images: [],
  };

  onInputValue = e => {
    console.log(e.target.value);
    this.setState({ q: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    console.log(e.target);

    try {
      const response = await axios.get(this.state.apiURL, {
        params: {
          key: this.state.apiKey,
          q: this.state.q,
          per_page: this.state.per_page,
          page: this.state.page,
          safesearch: true,
          image_type: 'photo',
        },
      });

      this.setState({ images: response.data.hits });
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    console.log(this.state.images);
    return (
      <>
        <form onSubmit={this.onSubmit}>
          <button type="submit">Search</button>
          <label>
            <input
              type="text"
              value={this.state.q}
              onChange={this.onInputValue}
              name="q"
            ></input>
          </label>
        </form>
        <div>
          {this.state.images.map(image => {
            return (
              <div key={image.id}>
                <img src={image.webformatURL} alt={image.name}></img>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Search;
