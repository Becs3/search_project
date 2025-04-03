import { ChangeEvent, FormEvent, useState } from 'react'
import './App.css'
import { IItem } from './models/Item';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<IItem[] | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          q: search,
          key: process.env.KEY,
          cx: process.env.CX
        }
      })
      const result = response.data;
      console.log(result)

      if (search.length <= 1) {
        throw new Error('Must contain characters')
      }
      if (result.items === undefined) {
        throw new Error('No search results')
      }

      setItems(result.items)

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }

  return (
    <div>
      <h2>Search</h2>
      <section>
        <form className="search-form">
          <input 
            type="text" 
            placeholder="search" 
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value)}}
          />
          
          <button onClick={handleSearch}>Search</button>
        </form>
      </section>

         <section>
          <h2>Search result</h2>

          {!items ? (
            <p>There are no results</p>
          ): ( items.map((item) => (
              <div key={item.title} className="search-result">
                <section>
                {!item.pagemap.cse_thumbnail ? (
                  <img src="https://via.placeholder.com/150" alt="No image available" />
                ) : (
                  <img src={item.pagemap.cse_thumbnail[0].src} alt="Thumbnail" />
                )}
                </section>

                <section>
                  <h3>{item.title}</h3>
                  <p>{item.snippet}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">To Product</a>
                </section>
              </div>
            ))
          )}
    </section> 
      
    </div>
  )}

export default App;
