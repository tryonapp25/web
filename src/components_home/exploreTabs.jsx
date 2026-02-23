import { useState , useRef,useEffect, useContext, useCallback} from "react";
import styles from "../styles/exploreTabs.module.css";
import FilterGrid from "../components/filterGrid";
import ImageGrid from "../components/imageGrid";
import FlashMessage from "../components/flashMessage";
import http from "../http/http";
import httpMessage from "../http/httpMessage";
import { UserContext } from "../ApiContext/userContext";
import LoadingModal from "../components/loading";

const cx = (...c) => c.filter(Boolean).join(" ");
const defaultMessage = {visible: false,type: "",msg: ""}

export default function ExploreTabs({onPressFilter}) {
  const [tab, setTab] = useState("explore");

  const { publicUser } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(defaultMessage);


   const didInitFetch = useRef(false);

  useEffect(() => {
    if (didInitFetch.current) return;
    didInitFetch.current = true;
    fetchFilters(1);
  },[])

  useEffect(() => {
    if (tab === "explore") {
      fetchFilters(1);
    } else {
      fetchImageGeneration();
    }
  }, [tab]);

  const fetchImageGeneration = async () => {
    if(loading) return;
    setLoading(true);
    setData([]);
    try{
      const res = await http.get(`/user/${publicUser?.uid}/imageGeneration`);
      if(res.data.success){
        setData(res.data.data);
      }
    }
    catch(err){
      setMessage({visible: true, type: "error", msg: httpMessage(err)})
    }finally{
      setLoading(false)
    }
  };

  const fetchFilters = async (pageNumber = 1) => {
    if(loading) return;
    setData([]);
    try {
      setLoading(true);
      const res = await http.get(
        `filters/user/${publicUser?.uid}/public-filters?page=${pageNumber}&limit=${limit}`
      );

      if (res.data.success) {
        setData((prev) => [...prev, ...res.data.data]);
        setHasNext(res.data.pagination?.hasNext);
      }
    } catch (err) {
      setMessage({visible: true, type: "error", msg: httpMessage(err)})
    } finally {
      setLoading(false);
    }
  };

  const loadNextPage = () => {
    if (hasNext && !loading) {
      setPage(prev => {
        const next = prev + 1;
        fetchFilters(next);
        return next;
      });
    }
  };

  const toggleLike = useCallback(async (id) => {
    let isLiked;
    setData((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextLiked = !p.isLiked;
          isLiked = nextLiked
          return {
            ...p,
            isLiked: nextLiked,
            likes: p.likes + (nextLiked ? 1 : -1),
          };
        }
        return p;
      })
    );

    if(isLiked){
      await handlesSetLikeFilter(publicUser?.uid, id)
    }
    else{
        await handlesDeleteLikeFilter(publicUser?.uid, id)
    }
  }, []);

  const handlesSetLikeFilter = async (uid, filterId) => {
    try{
      const res = await http.post(`/user/${uid}/like?filter=${filterId}`);
      if(res.data.success){
        log.info(res.data.message);
      }
    }
    catch(err){
      log.err(httpMessage(err));
    }
  }

  const handlesDeleteLikeFilter = async (uid, filterId) => {
    try{
      const res = await http.delete(`/user/${uid}/like?filter=${filterId}`);
      if(res.data.success){
        log.info(res.data.message);
      }
    }
    catch(err){
      log.err(httpMessage(err));
    }
  }


  return (
    <section className={styles.exploreWrap}>
      <div className={styles.exploreTabs}>
        <button
          className={cx(styles.exTab, tab === "explore" && styles.exTabActive)}
          onClick={() => setTab("explore")}
        >
          Explore
        </button>

        <button
          className={cx(styles.exTab, tab === "mine" && styles.exTabActive)}
          onClick={() => setTab("mine")}
        >
          My Creations
        </button>
      </div>

      {tab === "explore" ?
        <div>
          <FilterGrid
            data={data}
            onPressItem={(d)=> onPressFilter(d)}
            onToggleLike={(d) => toggleLike(d)}
          />
          <button onClick={() => loadNextPage()}>More..</button>
        </div>
        :
        <div>
          <ImageGrid data={data} onLongPress={(d) => console.log(d)}/>
        </div>  
      }
      <FlashMessage show={message.visible} type={message.type} message={message.msg} onClose={() => setMessage(defaultMessage)}/>
      <LoadingModal open={loading}/>
    </section>
  );
}
