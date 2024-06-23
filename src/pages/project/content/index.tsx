import { Suspense, useEffect, useRef } from "react";
import MarkdownEditor, {
  MarkdownEditorRef,
} from "@/components/ui/markdown-editor";
import { curTimestamp, debounce } from "@/lib/utils";
import { useDatabase } from "@/context/database";
import { useProject } from "../components/context";

const ContentPage = () => {
  const { data } = useProject();
  const db = useDatabase();
  const revisionRef = useRef(data._rev);
  const editorRef = useRef<MarkdownEditorRef>(null);
  const projectId = data._id;

  useEffect(() => {
    if (revisionRef.current !== data._rev) {
      editorRef.current?.setMarkdown(data.content);
    }
  }, [data]);

  const onChange = debounce(async (content: string) => {
    try {
      const project = await db.projects.get(projectId);
      const res = await db.projects.put({
        ...data,
        _rev: project._rev,
        content,
        updatedAt: curTimestamp(),
      });
      revisionRef.current = res.rev;
    } catch (err) {
      console.error(err);
    }
  }, 500);

  return (
    <Suspense>
      <MarkdownEditor
        ref={editorRef}
        className="h-full overflow-hidden px-4 md:px-8"
        markdown={data.content}
        onChange={onChange}
      />
    </Suspense>
  );
};

export default ContentPage;
