import React, { useEffect, useState } from 'react'
import styles from '../styles/FeatureFlags.module.css';
import http from '../http/http';
import httpMessage from '../http/httpMessage';

function Features() {
  const [flags, setFlags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const res = await http.get('/admin/featureFlags')
        if (res.data.success) {
          setFlags(res.data.data)
        } 
      } catch (e) {
        console.error('Failed to fetch feature flags', httpMessage(e))
      } finally {
        setLoading(false)
      }
    }

    fetchFlags()
  }, [])

  const [newName, setNewName] = useState('')
  const [newActive, setNewActive] = useState(0)
  const [creating, setCreating] = useState(false)

  const createFlag = async (e) => {
    e && e.preventDefault()
    if (!newName.trim()) return alert('Name is required')

    setCreating(true)
    try {
      const res = await http.post('/admin/featureFlags', {
        name: newName.trim(),
        isActive: newActive ? true : false,
      })

      if (res.data && res.data.success) {
        const created = res.data.data
        setFlags(prev => [created, ...prev])
        setNewName('')
        setNewActive(0)
      } else {
        throw new Error('create-failed')
      }
    } catch (err) {
      alert(httpMessage(err))
    } finally {
      setCreating(false)
    }
  }

  const toggleFlag = async (flag) => {
    setFlags(prev =>
      prev.map(f =>
        f.id === flag.id ? { ...f, isActive: f.isActive ? false : true } : f
      )
    )

    try {
      const res = await http.put(`/admin/featureFlags`, flag);
      if(res.data.success) {
        alert('Feature flag updated successfully');
      }
    } catch (e) {
      alert(httpMessage(e))
      // Revert back
      setFlags(prev =>
        prev.map(f =>
          f.id === flag.id ? { ...f, isActive: f.isActive ? false : true } : f
        )
      )
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading feature flags...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Feature Flags</h2>
            <p className={styles.subTitle}>
              Toggle features on or off per environment
            </p>
          </div>
        </div>

        <div style={{padding: '12px 0', borderBottom: '1px solid #eee'}}>
          <form onSubmit={createFlag} style={{display: 'flex', gap: 12, alignItems: 'center'}}>
            <input
              type="text"
              placeholder="Feature name (unique)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{padding: '8px 10px', flex: 1}}
            />

            <label style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
              <input
                type="checkbox"
                checked={!!newActive}
                onChange={(e) => setNewActive(e.target.checked ? 1 : 0)}
              />
              <span>Active</span>
            </label>

            <button type="submit" disabled={creating} style={{padding: '8px 14px'}}>
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.colId}>ID</th>
                <th className={styles.colName}>Name</th>
                <th className={styles.colActive}>Active</th>
                <th className={styles.colCreated}>Created At</th>
                <th className={styles.colActions}>Actions</th>
              </tr>
            </thead>

            <tbody className={styles.tbody}>
              {flags.map(flag => {
                const on = !!flag.isActive

                return (
                  <tr key={flag.id}>
                    <td>{flag.id}</td>

                    <td title={flag.name}>{flag.name}</td>

                    <td>
                      <span
                        className={`${styles.badge} ${
                          on ? styles.badgeOn : styles.badgeOff
                        }`}
                      >
                        {on ? 'Yes' : 'No'}
                      </span>
                    </td>

                    <td title={flag.createdAt}>
                      {new Date(flag.createdAt).toLocaleString()}
                    </td>

                    <td>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleFlag(flag)}
                        />
                        <span className={styles.slider} />
                      </label>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Features
