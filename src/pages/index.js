'use client';
import Search from "@/components/search"
import { useRouter } from 'next/router';

export default function Index () {
    const router = useRouter()

    const { tconst, nconst, name, genres, yearStart, yearEnd, query } = router.query

    return <Search  
      _tconst={tconst}
      _nconst={nconst}
      _name={name}
      _genres={genres}
      _yearStart={yearStart}
      _yearEnd={yearEnd}
      _query={query}/>
}