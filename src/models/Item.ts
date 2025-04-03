export interface IItem {

    link: string;
    snippet: string, 
    pagemap: {
      cse_thumbnail?: IItemThumbnail[]
    }; 
    title: string; 
  }
  
 interface IItemThumbnail {
    src:  string,
  }