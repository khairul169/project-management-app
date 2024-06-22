import { Suspense, useEffect, useRef } from "react";
import MarkdownEditor, {
  MarkdownEditorRef,
} from "@/components/ui/markdown-editor";
import { db } from "@/lib/db";
import { curTimestamp, debounce } from "@/lib/utils";
import { Project } from "@/schema/project";

type ContentEditorProps = {
  data: Project;
};

const ContentEditor = ({ data }: ContentEditorProps) => {
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
      const project = await db.get(projectId);
      const res = await db.put<Project>({
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
    <div className="p-4 md:p-8 md:pt-2 flex-1 overflow-hidden">
      <Suspense>
        <MarkdownEditor
          ref={editorRef}
          className="h-full overflow-hidden"
          markdown={data.content}
          onChange={onChange}
        />
      </Suspense>
    </div>
  );
};

export default ContentEditor;
