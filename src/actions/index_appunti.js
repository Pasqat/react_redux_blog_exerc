import _ from "lodash";
// importo lodash per fare il memoize

import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostAndUsers = () => async (dispatch, getState) => {
  // thunk riceve due argomenti, dispatch e getState. Il secondo ci permette di
  // accedere allo state di Redux

  //  non bsta chiamare fetchPosts() ma dobbiamo assicurarci di passare
  // la funzione in dispatch così che i rusltati vengano in ogni caso consegnati
  await dispatch(fetchPosts());

  // const userIds = _.uniq(_.map(getState().posts, "userId")); // ['1','2',..., n]
  // userIds.forEach((id) => dispatch(fetchUser(id)));
  //_.map() nell'esempio restituisce 100 userId, 10x1, 10x2, ... 10xn con _.uniq()
  // eliminiamo i doppioni

  _.chain(getState().posts)
    .map('userId')
    .uniq()
    .forEach(id => dispatch(fetchUser(id)))
    .value();
};

//! Cattivo approccio!!! Stiamo rompendo le regole di Redux
//  avendo async-await non stiamo restituendo un JS plain object!
//  anche se visto così sembrerebbe di si. Prova a ricopiare la
// funzione in babeljs.io. Scoprirai che async await crea uno switch
// statement e nel primo case non viene restituito un oggetto ma
// jsonPlaceholder.get("/posts");
//
// export const fetchPosts = async () => {
//   const response = await jsonPlaceholder.get("/posts");
//   return {
//     type: "FETCH_POSTS",
//     payload: response,
//   };
// };

export const fetchPosts = () => async (dispatch) => {
  const response = await jsonPlaceholder.get("/posts");

  // faccio il dispatch manuale
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = (id) => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: "FETCH_USER", payload: response.data });
};

//? la seguente è una soluzione ma forse non la migliore
// _ in questo caso sta per private function, non voglio che altri
// la modifichino
//
// export const fetchUser = (id) => (dispatch) => _fetchUser(id, dispatch);
//
//
// const _fetchUser = _.memoize(async (id, dispatch) => {
//   const response = await jsonPlaceholder.get(`/users/${id}`);
//
//   dispatch({ type: "FETCH_USER", payload: response.data });
// });
//
// un effeto indesiderato ovviamente è che non si potrà avere dati aggiornati
// ovvero non si potrà fare il refetch a meno di non creare una seconda azione
// con la stessa logica solo per rifare il refetch
