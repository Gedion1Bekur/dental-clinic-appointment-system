import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentsApi, dentistsApi } from '../../services/api';
import { datetimeLocalToISO, formatPrice } from '../../utils/format';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [dentists, setDentists] = useState([]);
  const [dentistId, setDentistId] = useState('');
  const [treatmentId, setTreatmentId] = useState('');
  const [datetimeStart, setDatetimeStart] = useState('');
  const [availableTreatments, setAvailableTreatments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDentists, setLoadingDentists] = useState(true);

  useEffect(() => {
    dentistsApi
      .list()
      .then((data) => setDentists(data.dentists))
      .finally(() => setLoadingDentists(false));
  }, []);

  useEffect(() => {
    const dentist = dentists.find((d) => String(d.id) === dentistId);
    setAvailableTreatments(dentist?.treatments || []);
    setTreatmentId('');
  }, [dentistId, dentists]);

  const selectedTreatment = availableTreatments.find((t) => String(t.id) === treatmentId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await appointmentsApi.create({
        dentistId: Number(dentistId),
        treatmentId: Number(treatmentId),
        datetimeStart: datetimeLocalToISO(datetimeStart),
      });
      setSuccess('Appointment confirmed. Redirecting…');
      setTimeout(() => navigate('/my-appointments'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Book a visit"
        subtitle="Select dentist, treatment, and time — we assign an available room automatically."
      />

      <div className="card card--flat page-narrow">
        {loadingDentists ? (
          <LoadingSpinner label="Loading dentists…" />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dentist">Dentist</label>
              <select
                id="dentist"
                value={dentistId}
                onChange={(e) => setDentistId(e.target.value)}
                required
              >
                <option value="">Choose a dentist</option>
                {dentists.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="treatment">Treatment</label>
              <select
                id="treatment"
                value={treatmentId}
                onChange={(e) => setTreatmentId(e.target.value)}
                required
                disabled={!dentistId}
              >
                <option value="">Choose a treatment</option>
                {availableTreatments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duration_minutes} min) — {formatPrice(t.price)}
                  </option>
                ))}
              </select>
            </div>

            {selectedTreatment && (
              <p className="hint-text">
                Estimated duration: <strong>{selectedTreatment.duration_minutes} minutes</strong>
              </p>
            )}

            <div className="form-group">
              <label htmlFor="datetime">Date & time</label>
              <input
                id="datetime"
                type="datetime-local"
                value={datetimeStart}
                onChange={(e) => setDatetimeStart(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? <span className="btn-loading">Booking…</span> : 'Confirm booking'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
