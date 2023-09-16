import { React, Component } from 'react';
import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Loader from './Loader/Loader';

export class App extends Component {
  state = {
    apiURL: 'https://pixabay.com/api/',
    apiKey: '38646134-f0d35baa377bc06e37b81532c',
    page: 1,
    q: '',
    per_page: 12,
    images: [],
    isLoading: false,
    loadMore: false,
  };

  createLightbox = () => {
    const lightbox = new SimpleLightbox('.gallery a', {
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    return lightbox;
  };

  componentDidUpdate() {
    this.createLightbox();
  }

  onInputValue = e => {
    console.log(e.target.value);
    if (e.target.value !== '') {
      this.setState({ q: e.target.value.trim() });
    }
  };

  onSubmitForm = async e => {
    e.preventDefault();
    console.log(e.target);
    try {
      if (this.state.page !== 1) {
        await this.setState({ page: 1 });
      }

      this.setState({ isLoading: true });

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
      console.log(response.data);

      if (response.data.totalHits > 12) {
        this.setState({ loadMore: true });
      } else {
        this.setState({ loadMore: false });
      }

      this.setState({ images: response.data.hits });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onLoadMoreBnt = async e => {
    console.log(e.target);

    try {
      await this.setState(prevState => ({
        isLoading: true,
        page: prevState.page + 1,
      }));
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
      console.log(response.data);
      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
      }));
      if (response.data.totalHits <= 12) {
        this.setState({ loadMore: false });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmitForm}>
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

        <div className="gallery">
          {this.state.images.map(image => {
            return (
              <a href={image.largeImageURL} key={image.id}>
                <img src={image.webformatURL} alt={image.name}></img>
              </a>
            );
          })}
        </div>
        {this.state.isLoading && <Loader />}
        {this.state.loadMore && (
          <button onClick={this.onLoadMoreBnt}>Load more</button>
        )}
      </div>
    );
  }
}
