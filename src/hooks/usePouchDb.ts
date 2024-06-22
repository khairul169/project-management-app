import { useCallback, useEffect, useState } from "react";

type GetAllOptions =
  | PouchDB.Core.AllDocsWithKeyOptions
  | PouchDB.Core.AllDocsWithinRangeOptions
  | PouchDB.Core.AllDocsOptions;

export const useGetAll = <T extends {}>(
  db: PouchDB.Database,
  options?: GetAllOptions
) => {
  const [data, setData] = useState<PouchDB.Core.AllDocsResponse<T>>();

  const fetch = useCallback(async () => {
    try {
      const result = await db.allDocs<T>({ include_docs: true, ...options });
      setData(result);
    } catch (err) {}
  }, [db, options]);

  useEffect(() => {
    fetch();

    const listener = db
      .changes({
        live: true,
        since: "now",
      })
      .on("change", fetch);

    return () => {
      listener.cancel();
    };
  }, [db, fetch, options]);

  return { data, refetch: fetch };
};

type GetOneOptions = PouchDB.Core.GetOptions;

type GetOneResponse<T extends {}> = T &
  PouchDB.Core.IdMeta &
  PouchDB.Core.GetMeta;

export const useGetOne = <T extends {}>(
  db: PouchDB.Database,
  id: string,
  options?: GetOneOptions
) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<GetOneResponse<T>>();
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const result = await db.get<T>(id, options);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [db, id, options]);

  useEffect(() => {
    fetch();

    const listener = db
      .changes({
        live: true,
        since: "now",
        include_docs: true,
        doc_ids: [id],
      })
      .on("change", (data) => {
        if (data.doc) {
          setData((state) => ({ ...state, ...(data.doc as any) }));
        }
      });

    return () => {
      listener.cancel();
    };
  }, [id, db, fetch]);

  return { isLoading, error, data, refetch: fetch };
};
