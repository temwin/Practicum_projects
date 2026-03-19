import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, type CheckboxState } from '../checkbox';
import { Icon } from '../icons';
import { buildFilterTree } from './utils';
import styles from './FilterTree.module.scss';
import type { FilterTreeNode } from './types';

export interface FilterTreeProps {
  // Иерархический режим
  categoryUrl?: string;
  subcategoriesUrl?: string;
  // Плоский режим
  url?: string;

  maxVisible?: number;
  onSelectionChange?: (selected: { id: number; name: string }[]) => void;

  showAllText?: string;
  collapseText?: string;

  resetKey?: number;
}

const FilterTree: React.FC<FilterTreeProps> = ({
  categoryUrl,
  subcategoriesUrl,
  url,
  maxVisible = 5,
  onSelectionChange,
  showAllText = 'Все категории',
  collapseText = 'Свернуть',
  resetKey,
}) => {
  const [treeData, setTreeData] = useState<FilterTreeNode[]>([]);
  const [flatData, setFlatData] = useState<{ id: number; name: string }[]>([]);
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [indeterminateMap, setIndeterminateMap] = useState<Record<string, boolean>>({});

  const isFlatMode = !!url;
  const isTreeMode = !!categoryUrl && !!subcategoriesUrl;

  // Чтобы не было бесконечного цикла при resetKey:
  // держим актуальный onSelectionChange в ref, а reset-effect зависит только от resetKey
  const onSelectionChangeRef = useRef<FilterTreeProps['onSelectionChange']>(onSelectionChange);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  // Загрузка данных
  useEffect(() => {
    if (isFlatMode) {
      fetch(url!)
        .then((res) => res.json())
        .then((data) => {
          const list = data || [];
          if (!Array.isArray(list)) {
            console.error(
              'Invalid flat data format: expected array under "cities", "subcategories", or "categories"'
            );
            return;
          }
          setFlatData(list);
        })
        .catch((err) => console.error('Failed to load flat data:', err));
    } else if (isTreeMode) {
      Promise.all([
        fetch(categoryUrl!).then((res) => res.json()),
        fetch(subcategoriesUrl!).then((res) => res.json()),
      ])
        .then(([categoryData, subcategoriesData]) => {
          if (!categoryData || !subcategoriesData) {
            throw new Error('Invalid response format: missing categories or subcategories');
          }
          const tree = buildFilterTree(categoryData, subcategoriesData);
          setTreeData(tree);
        })
        .catch((err) => console.error('Failed to load filter data:', err));
    }
  }, [url, categoryUrl, subcategoriesUrl, isFlatMode, isTreeMode]);

  // ✅ reset только по resetKey — без зависимости onSelectionChange (иначе будет цикл)
  useEffect(() => {
    if (resetKey === undefined) return;

    setCheckedMap({});
    setIndeterminateMap({});
    setExpandedMap({});
    setShowAll(false);

    onSelectionChangeRef.current?.([]);
  }, [resetKey]);

  const findNodeById = (nodes: FilterTreeNode[], id: string): FilterTreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleCheckboxChangeTree = (nodeId: string, newState: CheckboxState) => {
    const isChecked = newState === 'checked';
    setCheckedMap((prevChecked) => {
      const newChecked = { ...prevChecked, [nodeId]: isChecked };
      const newIndeterminate = { ...indeterminateMap };

      if (newState !== 'indeterminate') {
        delete newIndeterminate[nodeId];
      }

      const node = findNodeById(treeData, nodeId);
      if (!node) {
        setIndeterminateMap(newIndeterminate);
        return newChecked;
      }

      if (node.children) {
        node.children.forEach((child) => {
          newChecked[child.id] = isChecked;
          delete newIndeterminate[child.id];
        });
      }

      if (node.subcategoryId) {
        const parent = treeData.find((n) => n.categoryId === node.categoryId);
        if (parent?.children) {
          const children = parent.children;
          const allChecked = children.every((child) => newChecked[child.id]);
          const someChecked = children.some((child) => newChecked[child.id]);
          newChecked[parent.id] = allChecked;
          if (someChecked && !allChecked) {
            newIndeterminate[parent.id] = true;
          } else {
            delete newIndeterminate[parent.id];
          }
        }
      }

      setIndeterminateMap(newIndeterminate);

      const selected: { id: number; name: string }[] = [];

      Object.entries(newChecked).forEach(([id, checked]) => {
        if (checked) {
          const n = findNodeById(treeData, id);
          if (n && n.subcategoryId) {
            selected.push({ id: n.subcategoryId, name: n.label });
          }
        }
      });

      onSelectionChangeRef.current?.(selected);

      return newChecked;
    });
  };

  const handleCheckboxChangeFlat = (id: number, newState: CheckboxState) => {
    const isChecked = newState === 'checked';
    const key = String(id);

    setCheckedMap((prev) => {
      const newCheckedMap = { ...prev, [key]: isChecked };

      const selected = flatData.filter((item) => newCheckedMap[String(item.id)]);
      onSelectionChangeRef.current?.(selected);

      return newCheckedMap;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // доработка для разворачивания всех узлов
  const buildExpandedMapForAll = (nodes: FilterTreeNode[]) => {
    const map: Record<string, boolean> = {};

    const walk = (items: FilterTreeNode[]) => {
      items.forEach((node) => {
        if (node.children?.length) {
          map[node.id] = true;
          walk(node.children);
        }
      });
    };

    walk(nodes);
    return map;
  };

  const toggleShowAll = () => {
    setShowAll((prev) => {
      const next = !prev;

      if (next) {
        const expanded = buildExpandedMapForAll(treeData);
        setExpandedMap(expanded);
      } else {
        setExpandedMap({});
      }

      return next;
    });
  };

  const TreeNode: React.FC<{
    node: FilterTreeNode;
    expanded: boolean;
    checked: boolean;
    indeterminate: boolean;
    onToggleExpand?: () => void;
    onCheckboxChange: (id: string, state: CheckboxState) => void;
  }> = ({ node, expanded, checked, indeterminate, onToggleExpand, onCheckboxChange }) => {
    const checkboxState: CheckboxState = indeterminate
      ? 'indeterminate'
      : checked
        ? 'checked'
        : 'empty';

    return (
      <div className={styles.node}>
        <Checkbox
          state={checkboxState}
          onChange={(newState) => onCheckboxChange(node.id, newState)}
          label={node.label}
          onToggleExpand={onToggleExpand}
          isExpanded={expanded}
        />
        {node.children && expanded && (
          <div className={styles.children}>
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                expanded={false}
                checked={checkedMap[child.id] || false}
                indeterminate={indeterminateMap[child.id] || false}
                onCheckboxChange={onCheckboxChange}
                onToggleExpand={undefined}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isFlatMode) {
    const visibleItems = showAll ? flatData : flatData.slice(0, maxVisible);
    return (
      <div className={styles.filterTree}>
        <div className={styles.tree}>
          {visibleItems.map((item) => (
            <div key={item.id} className={styles.node}>
              <Checkbox
                state={checkedMap[String(item.id)] ? 'checked' : 'empty'}
                onChange={(newState) => handleCheckboxChangeFlat(item.id, newState)}
                label={item.name}
              />
            </div>
          ))}
          {flatData.length > maxVisible && (
            <button type='button' className={styles.toggleButton} onClick={toggleShowAll}>
              {showAll ? collapseText : showAllText}
              <Icon name={showAll ? 'chevronUp' : 'chevronDown'} />
            </button>
          )}
        </div>
      </div>
    );
  }

  const visibleRootNodes = showAll ? treeData : treeData.slice(0, maxVisible);

  return (
    <div className={styles.filterTree}>
      <div className={styles.tree}>
        {visibleRootNodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            expanded={expandedMap[node.id] || false}
            checked={checkedMap[node.id] || false}
            indeterminate={indeterminateMap[node.id] || false}
            onToggleExpand={node.children ? () => toggleExpand(node.id) : undefined}
            onCheckboxChange={handleCheckboxChangeTree}
          />
        ))}

        <button type='button' className={styles.toggleButton} onClick={toggleShowAll}>
          {showAll ? collapseText : showAllText}
          <Icon name={showAll ? 'chevronUp' : 'chevronDown'} />
        </button>
      </div>
    </div>
  );
};

export { FilterTree };
export default FilterTree;
