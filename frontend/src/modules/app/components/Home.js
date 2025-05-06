import "../style/App.css";
import {DataSearch, RangeInput, ReactiveBase, ReactiveList, SelectedFilters} from "@appbaseio/reactivesearch";

const Home = () => {

  return (
      /*
      <ReactiveBase className="ReactiveBase" app="theeasteregg_games_index" url="http://localhost:9200">
          <div className="Content">
              <Searchbar />
              <p>-----</p>
              <DataSearch
                          componentId="DataSearchItem"
                          dataField={['name']}
                          fieldWeights={[9]}
                          placeholder="Buscar..."
              />
              <p>-----</p>
              <SelectedFilters
                  style={{
                      marginLeft: 10,
                      marginBottom: 20,
                  }}
              />
              <p>-----</p>
              <ReactiveList
                  componentId="result"
                  dataField="_score"
                  react={{
                      and: ["DataSearchItem"]
                  }}
                  renderItem={RenderItem}
              />
              <p>FIN</p>
        </div>
      </ReactiveBase>*/


      <ReactiveBase
          app="theeasteregg_games_index"
          url="http://localhost:9200"
      >
          <DataSearch
              componentId="Search"
              dataField={['name']}
              placeholder="Buscar juego..."
              fuzziness={1}
          />

          <ReactiveList
              componentId="Result"
              dataField="_score"
              size={10}
              pagination
              react={{
                  and: ['Search'],
              }}
              render={({ data }) => {
                  console.log('Resultados:', data);
                  return (
                      <ul>
                          a
                      </ul>
                  );
              }}
          />
      </ReactiveBase>

  );
};

export default Home;
