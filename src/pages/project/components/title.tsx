import Appbar from "@/components/containers/appbar";
import { IconButton } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Project } from "@/schema/project";
import { curTimestamp } from "@/lib/utils";
import { useDatabase } from "@/context/database";

type Props = {
  data: Project;
};

const Title = ({ data }: Props) => {
  const db = useDatabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);

  const onSubmit = async (title: string) => {
    try {
      await db.projects.put({
        ...data,
        _rev: data._rev!,
        title,
        updatedAt: curTimestamp(),
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full truncate">
      {!editing ? (
        <Appbar.Title>{data.title}</Appbar.Title>
      ) : (
        <Input
          ref={inputRef}
          className="focus-visible:ring-0 focus-visible:outline-none"
          autoFocus
          defaultValue={data.title}
          onKeyUp={(e) =>
            e.key === "Enter" && onSubmit((e.target as HTMLInputElement).value)
          }
        />
      )}

      {editing ? (
        <IconButton
          icon={<Save size={18} />}
          variant="default"
          onClick={() => onSubmit(inputRef.current?.value || "")}
        />
      ) : (
        <IconButton
          icon={<Pencil size={18} />}
          variant="ghost"
          onClick={() => setEditing(true)}
        />
      )}
    </div>
  );
};

export default Title;
