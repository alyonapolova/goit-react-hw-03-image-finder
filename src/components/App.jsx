import { React, Component } from 'react';
import Search from './Search/Search';
//import Image from './images/Images';
export class App extends Component {
  state = { images: [] };

  render() {
    return (
      <div>
        <Search />
        {/* <Image images={this.state.images} /> */}
      </div>
    );
  }
}
