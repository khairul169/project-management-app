import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  InsertImage,
  InsertThematicBreak,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  imagePlugin,
  listsPlugin,
  markdownShortcutPlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { headingsPlugin, quotePlugin } from "@mdxeditor/editor";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import "@mdxeditor/editor/style.css";

export type MarkdownEditorProps = ComponentPropsWithoutRef<typeof MDXEditor>;
export type MarkdownEditorRef = MDXEditorMethods;

const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
  ({ ...props }, ref) => {
    return (
      <MDXEditor
        ref={ref}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <InsertImage />
                <InsertThematicBreak />
              </>
            ),
          }),
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          imagePlugin(),
        ]}
        contentEditableClassName="mdxeditor-contenteditable prose max-w-none"
        {...props}
      />
    );
  }
);

export default MarkdownEditor;
