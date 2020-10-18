import { createElement } from '../lib/framework';
import Carousel from '../lib/carousel/index';
import Button from '../lib/button/index';
import List from '../lib/list/index';

const imgs = [
  {
    src: 'http://static001.geekbang.org/resource/image/95/d1/95775d0927a580170673aedfc70e33d1.jpg',
    url: 'https://time.geekbang.org',
    title: '猫1'
  },
  {
    src: 'http://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    url: 'https://time.geekbang.org',
    title: '猫2'
  },
  {
    src: 'http://static001.geekbang.org/resource/image/9f/28/9f68cbdfd275739a1cd3a4dfa85ead28.jpg',
    url: 'https://time.geekbang.org',
    title: '猫3'
  },
  {
    src: 'http://static001.geekbang.org/resource/image/93/15/930dd42f9a18d851eeededf14dbc0b15.jpg',
    url: 'https://time.geekbang.org',
    title: '猫4'
  }
]

let carousel = <Carousel data={imgs} onChange={event => console.log(event.detail.position)} onClick={event => window.location.href = event.detail.data.url}/>;
let button = <Button>content</Button>
let list = <List data={imgs}>
  {(record) =>
      <div>
          <img src={ record.src } />
          <a href={ record.url }>{ record.title }</a>
      </div>
  }
</List>
carousel.mountTo(document.body)
button.mountTo(document.body)
list.mountTo(document.body)
