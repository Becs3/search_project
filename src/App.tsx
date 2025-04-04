import { ChangeEvent, FormEvent, useState } from 'react'
import './App.css'
import { IItem } from './models/Item';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<IItem[] | null>(null);
  const [startIndex, setStartIndex] = useState<number>(1); 
  const [totalResults, setTotalResults] = useState<number>(0);

  const handleSearch = async (e: FormEvent, newStartIndex = 1) => {
    e.preventDefault()
    
    try {
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          q: search,
          key: 'AIzaSyBR2MJcO0Ym-jaDzGL_NMfZZUZJzuaA8Vc',
          cx: "242f239e146074624",
          start: newStartIndex,
          num: 10
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
      setTotalResults(result.searchInformation.totalresults);
      setStartIndex(newStartIndex)

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }


  return (
    <div className="container">
      <section>
        <h2>Search</h2>
        <form onSubmit={(e) => handleSearch(e)}>
          <input 
            type="text" 
            placeholder="search" 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section>
        <h2>Search results</h2>

        {!items ? (
          <p>There are no results</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.title} className="search-result">
                <section>
                  {!item.pagemap?.cse_thumbnail ? (
                    <img src="https://tacm.com/wp-content/uploads/2018/01/no-image-available.jpeg" alt="No image available" />
                  ) : (
                    <img src={item.pagemap.cse_thumbnail[0].src} alt="Thumbnail" />
                  )}
                </section>

                <section className='result-text'>
                  <h3>{item.title}</h3>
                  <p>{item.snippet}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer">To Product</a>
                </section>
              </div>
            ))}

            <div className="pagination">
              <button 
                disabled={startIndex <= 1} 
                onClick={(e) => handleSearch(e, startIndex - 10)}
              >
                Previous
              </button>

              <button 
                disabled={startIndex + 10 > totalResults} 
                onClick={(e) => handleSearch(e, startIndex + 10)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
