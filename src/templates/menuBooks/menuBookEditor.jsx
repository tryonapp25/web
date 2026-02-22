import styles from "./menuBookEditor.module.css";
import EditButom from "../../components/editButton";
import { useEffect, useState, useContext} from "react";
import CollectionTemplatesGrid from "../../components/collectionTemplatesGrid";
import http from "../../http/http";
import httpMessage from "../../http/httpMessage";
import { UserContext } from "../../ApiContext/userContext";
import LoadingModal from "../../components/loading";
import TemplateGrid from "../../components/templateGrid";
import PosterTemplateGrid from "../../components/posterTemplateGrid";
import FlashMessage from "../../components/flashMessage";

const defaultMessage = { visible: false, type: "", msg: "" };

export default function MenuBookEditor({ data, onChange}) {
  const {publicUser} = useContext(UserContext);
  const [updateData, setUpdateData] = useState(data ?? null);
  const [message, setMessage] = useState(defaultMessage);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdateData(data ?? null);
  }, [data]);

  if (!updateData) return null;

  // ------------------------
  // root updates (menubook)
  // ------------------------
  const updateRoot = (key, value) => {
    setUpdateData((prev) => ({ ...prev, [key]: value }));
  };

  const updateRootInfo = (key, value) => {
    setUpdateData((prev) => ({
      ...prev,
      information: { ...(prev.information ?? {}), [key]: value },
    }));
  };

  // ------------------------
  // template (menu) updates
  // updateData.contents = array of templates
  // each template has .contents = array of sections
  // ------------------------
  const updateTemplate = (tplIndex, patch) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      nextTemplates[tplIndex] = { ...nextTemplates[tplIndex], ...patch };
      return { ...prev, contents: nextTemplates };
    });
  };

  const updateTemplateInfo = (tplIndex, key, value) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];
      nextTemplates[tplIndex] = {
        ...tpl,
        information: { ...(tpl.information ?? {}), [key]: value },
      };
      return { ...prev, contents: nextTemplates };
    });
  };

  const addTemplate = async () => {
    await handleGetUserProductionTemaplate(publicUser?.uid);
  };

  const removeTemplate = (tplIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = (prev.contents ?? []).filter((_, i) => i !== tplIndex);
      return { ...prev, contents: nextTemplates };
    });
  };

  // ------------------------
  // section updates (inside a template)
  // ------------------------
  const updateSection = (tplIndex, sectionIndex, patch) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      nextSections[sectionIndex] = { ...nextSections[sectionIndex], ...patch };

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  const addSection = (tplIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      nextSections.push({
        title: `Section ${nextSections.length + 1}`,
        model: "",
        data: [],
      });

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  const removeSection = (tplIndex, sectionIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = (tpl.contents ?? []).filter((_, i) => i !== sectionIndex);

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  // ------------------------
  // row/item updates (inside section)
  // ------------------------
  const updateRow = (tplIndex, sectionIndex, rowIndex, patch) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      const section = nextSections[sectionIndex];

      const nextRows = [...(section.data ?? [])];
      nextRows[rowIndex] = { ...nextRows[rowIndex], ...patch };

      nextSections[sectionIndex] = { ...section, data: nextRows };
      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };

      return { ...prev, contents: nextTemplates };
    });
  };

  const addRow = (tplIndex, sectionIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      const section = nextSections[sectionIndex];

      nextSections[sectionIndex] = {
        ...section,
        data: [
          ...(section.data ?? []),
          { name: "", description: "", price: "", quantity: "1" },
        ],
      };

      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };
      return { ...prev, contents: nextTemplates };
    });
  };

  const removeRow = (tplIndex, sectionIndex, rowIndex) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];
      const tpl = nextTemplates[tplIndex];

      const nextSections = [...(tpl.contents ?? [])];
      const section = nextSections[sectionIndex];

      const nextRows = (section.data ?? []).filter((_, i) => i !== rowIndex);

      nextSections[sectionIndex] = { ...section, data: nextRows };
      nextTemplates[tplIndex] = { ...tpl, contents: nextSections };

      return { ...prev, contents: nextTemplates };
    });
  };

  const handleOnchange = () => {
    onChange(updateData)
  };

  const handleGetUserProductionTemaplate = async (uid) => {
    try {
      setLoading(true);

      // get normal templates
      const res = await http.get(`/user/${uid}/production/templates`);

      let baseTemplates = [];

      if (res.data.success) {
        baseTemplates = res.data.data;
        setTemplates(baseTemplates);
      }

      // get poster templates and merge
      await handleGetUserProductionPosterTemplates(uid);

    } catch (err) {
      console.log(httpMessage(err));
    } finally {
      setLoading(false);
      setShowTemplateModal(true);
    }
  };


  const handleGetUserProductionPosterTemplates = async (uid) => {
    try {
      const res = await http.get(`/poster/user/${uid}/production/templates`);

      if (res.data.success) {
        setTemplates(prev => [
          ...(prev ?? []),
          ...res.data.data
        ]);
      }

    } catch (err) {
      console.log(httpMessage(err));
    }
  };

  const handleAddTemplate = (t) => {
    setUpdateData((prev) => {
      const nextTemplates = [...(prev.contents ?? [])];

      // check if id already exists
      const exists = nextTemplates.some(template => template.id === t.id);

      // if not exists, add it
      if (!exists) {
        nextTemplates.push(t);
      }
      else{
        setMessage({visible: true, type: "error", msg: "Template already added!"});
        setTimeout(() => setMessage(defaultMessage), 3000);
      }

      return { ...prev, contents: nextTemplates };
    });

    console.log("Selected template to add:", t);
  };


  return (
    <div className={styles.editor}>
      <main style={{ width: "95%", height: "100%" }}>
        <EditButom text="Save" onClick={() => handleOnchange()} />

        <div className={styles.header}>
          <h2 className={styles.title}>Menu Book Editor</h2>
          <p className={styles.subtitle}>
            Edit menu book info, templates, sections, and items.
          </p>
        </div>

        {/* Root (MenuBook) */}
        <div className={styles.card}>
          <div className={styles.grid2}>
            <label className={styles.label}>
              <span className={styles.labelText}>MenuBook Heading</span>
              <input
                className={styles.input}
                value={updateData.heading ?? ""}
                onChange={(e) => updateRoot("heading", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>MenuBook Subheading</span>
              <input
                className={styles.input}
                value={updateData.subheading ?? ""}
                onChange={(e) => updateRoot("subheading", e.target.value)}
              />
            </label>
          </div>

          <div className={styles.grid3}>
            <label className={styles.label}>
              <span className={styles.labelText}>Email</span>
              <input
                className={styles.input}
                value={updateData.information?.email ?? ""}
                onChange={(e) => updateRootInfo("email", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Phone</span>
              <input
                className={styles.input}
                value={updateData.information?.phone ?? ""}
                onChange={(e) => updateRootInfo("phone", e.target.value)}
              />
            </label>

            <label className={styles.label}>
              <span className={styles.labelText}>Address</span>
              <input
                className={styles.input}
                value={updateData.information?.address ?? ""}
                onChange={(e) => updateRootInfo("address", e.target.value)}
              />
            </label>
          </div>
        </div>

        {/* Templates list */}
        <div className={styles.templatesTop}>
          <h3 className={styles.sectionTitle}>Templates</h3>
          <button type="button" className={styles.addRow} onClick={addTemplate}>
            + Add template
          </button>
        </div>

        {(updateData.contents ?? []).map((tpl, t) => (
          <div key={tpl.id ?? t} className={styles.card} style={{marginTop:"10px"}}>
            <button
              type="button"
              className={styles.removeRow}
              onClick={() => removeTemplate(t)}
            >
              &times;
            </button>
            {tpl.category === "poster" ? 
              <PosterTemplateGrid
                templates={[tpl]}
              />
              :(
              <TemplateGrid
                templates={[tpl]}
              />
            )}
          </div>
        ))}
      </main>

      <CollectionTemplatesGrid
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={templates}
        title="Select a template to add"
        onSelect={(t) => handleAddTemplate(t)}
      />

      <FlashMessage
        show={message.visible}
        type={message.type}
        message={message.msg}
        onClose={() => setMessage(defaultMessage)}
      />

      <LoadingModal open={loading} title="Loading templates..."/>
    </div>
  );
}
