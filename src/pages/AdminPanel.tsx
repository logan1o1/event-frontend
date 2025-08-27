import React, { useState, useEffect, useMemo } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../contexts/AuthContext';
// import { useUsers } from '../hooks/useUsers';
import { FaUsers, FaCalendarAlt, FaChartBar, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import { useAuth as useAuthAPI } from '../hooks/useAuth';
import type { Event, DashboardStats, User } from '../types';
import EventForm from '../components/EventForm';
import EventDetails from '../components/EventDetails';

const AdminPanel: React.FC = () =>
{
  const [ dashboardStats, setDashboardStats ] = useState<DashboardStats | null>( null );
  const [ events, setEvents ] = useState<Event[]>( [] );
  const [ users, setUsers ] = useState<User[]>( [] );
  const [ loading, setLoading ] = useState( true );
  const [ activeTab, setActiveTab ] = useState<'dashboard' | 'events' | 'users'>( 'dashboard' );
  const [ isEventFormOpen, setIsEventFormOpen ] = useState( false );
  const [ isEventDetailsOpen, setIsEventDetailsOpen ] = useState( false );
  const [ selectedEvent, setSelectedEvent ] = useState<Event | null>( null );
  const [ editingEvent, setEditingEvent ] = useState<Event | null>( null );
  const [searchTerm, setSearchTerm] = useState('');
  // const [newCategoryName, setNewCategoryName] = useState('');

  const { getDashboardStats, getAdminEvents, deleteAdminEvent, updateAdminEvent, error, createCategory } = useAdmin();
  // const { getUsers } = useUsers();
  const { admin, token } = useAuth();
  const { getUsers } = useAuthAPI();

  useEffect( () =>
  {
    const fetchData = async () =>
    {
      try
      {
        if ( token )
        {
          const [ stats, eventsData, usersData ] = await Promise.all( [
            getDashboardStats( token ),
            getAdminEvents( token ),
            getUsers()
          ] );
          setDashboardStats( stats );
          setEvents( eventsData );
          setUsers( usersData );
        }
      } catch ( error )
      {
        console.error( 'Error fetching admin data:', error );
      } finally
      {
        setLoading( false );
      }
    };

    if ( token )
    {
      fetchData();
    }
  }, [ token, getDashboardStats, getAdminEvents, getUsers ] );

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events;
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const userMap = useMemo( () => {
    const map = new Map<number, string>();
    users.forEach( user =>
    {
      map.set( user.id, user.username );
    } );
    return map;
  }, [ users ] );

  const handleDeleteEvent = async ( eventId: number ) => {
    if ( window.confirm( 'Are you sure you want to delete this event?' ) )
    {
      if ( token )
      {
        const success = await deleteAdminEvent( eventId, token );
        if ( success )
        {
          setEvents( events.filter( event => event.id !== eventId ) );
        }
      }
    }
  };

  const handleUpdateEvent = async ( eventDataFromForm: Event ) =>
  {
    if ( !token ) return;
    const { id: eventId, ...eventData } = eventDataFromForm;
    const updatedEventResponse = await updateAdminEvent( eventId, eventData, token );
    if ( updatedEventResponse )
    {
      setEvents( prev => prev.map( event => event.id === updatedEventResponse.id ? updatedEventResponse : event ) );
      setIsEventFormOpen( false );
    }
  };

  const openUpdateEventForm = ( event: Event ) =>
  {
    setEditingEvent( event );
    setIsEventDetailsOpen( false );
    setIsEventFormOpen( true );
  };

  const openEventDetails = ( event: Event ) =>
  {
    setSelectedEvent( event );
    setIsEventDetailsOpen( true );
  };

  // const handleCreateCategory = async () => {
  //   if (!token || !newCategoryName.trim()) return;
    
  //   const newCategory = await createCategory(newCategoryName, token);
  //   if (newCategory) {
  //     // Add the new category to your local state to update the UI
  //     // setCategories(prev => [...prev, newCategory]); 
  //     setNewCategoryName(''); // Clear the input field
  //   }
  // };

  if ( loading )
  {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Welcome back, { admin?.email }</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={ () => setActiveTab( 'dashboard' ) }
              className={ `py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === 'dashboard'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }` }
            >
              Dashboard
            </button>
            <button
              onClick={ () => setActiveTab( 'events' ) }
              className={ `py-4 px-1 border-b-2 font-medium text-sm ${ activeTab === 'events'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }` }
            >
              Events
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        { activeTab === 'dashboard' && dashboardStats && (
          <div className="space-y-6">
            {/* <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Category</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleCreateCategory}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaUsers className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{ dashboardStats.total_users }</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaCalendarAlt className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                        <dd className="text-lg font-medium text-gray-900">{ dashboardStats.total_events }</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FaChartBar className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Recent Events</dt>
                        <dd className="text-lg font-medium text-gray-900">{ dashboardStats.recent_events.length }</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Events</h3>
                <div className="space-y-4">
                  { dashboardStats.recent_events.map( ( event ) => (
                    <div key={ event.id } className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={ event.poster_url || 'https://via.placeholder.com/60x60?text=Event' }
                          alt={ event.title }
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{ event.title }</h4>
                          <p className="text-sm text-gray-500">by by { userMap.get( event.user_id ) || 'Unknown User' }</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        { new Date( event.date ).toLocaleDateString() }
                      </div>
                    </div>
                  ) ) }
                </div>
              </div>
            </div>
          </div>
        ) }

        { ( activeTab === 'events' || activeTab === 'users' ) && (
          <div className="mb-6">
            <input
              type="text"
              placeholder={ `Search in ${ activeTab }...` }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        ) }

        { activeTab === 'events' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Manage Events</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    { filteredEvents.map( ( event ) => (
                      <tr key={ event.id }>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={ event.poster_url || 'https://via.placeholder.com/40x40?text=Event' } alt={ event.title } className="h-10 w-10 rounded-lg object-cover mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{ event.title }</div>
                              <div className="text-sm text-gray-500">{ event.location }</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ userMap.get( event.user_id ) || 'Unknown User' }</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ new Date( event.date ).toLocaleDateString() }</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button onClick={ () => openEventDetails( event ) } className="text-blue-600 hover:text-blue-900"><FaEye className="h-4 w-4" /></button>
                            <button onClick={ () => openUpdateEventForm( event ) } className="text-green-600 hover:text-green-900"><FaEdit className="h-4 w-4" /></button>
                            <button onClick={ () => handleDeleteEvent( event.id ) } className="text-red-600 hover:text-red-900"><FaTrash className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ) ) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) }
      </div>

      { error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">{ error }</div>
      ) }

      <EventForm
        isOpen={ isEventFormOpen }
        onClose={ () => setIsEventFormOpen( false ) }
        event={ editingEvent || undefined }
        onEventCreated={ ( event ) => setEvents( prev => [ event, ...prev ] ) }
        onEventUpdated={ handleUpdateEvent }
      />

      { selectedEvent && (
        <EventDetails
          isOpen={ isEventDetailsOpen }
          onClose={ () => setIsEventDetailsOpen( false ) }
          event={ selectedEvent }
          onUpdate={ openUpdateEventForm }
          onDelete={ handleDeleteEvent }
        />
      ) }
    </div>
  );
};

export default AdminPanel;
