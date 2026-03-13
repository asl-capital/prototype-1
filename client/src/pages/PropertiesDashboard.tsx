import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Building2, MapPin, ChevronLeft, Clock, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState, Property } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Properties Dashboard (عقاراتي)
 * - Property cards with qualification status
 * - Eligible amount display
 * - Premium card styling with shadows
 */

const getQualificationLabel = (status: Property['qualificationStatus']) => {
  switch (status) {
    case 'qualified_24h':
      return 'مؤهل لتمويل خلال 24 ساعة';
    case 'qualified_48h':
      return 'مؤهل لتمويل خلال 48 ساعة';
    case 'not_qualified':
      return 'غير مؤهل';
  }
};

const getQualificationStyle = (status: Property['qualificationStatus']) => {
  switch (status) {
    case 'qualified_24h':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'qualified_48h':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'not_qualified':
      return 'bg-red-50 text-red-700 border-red-200';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

export default function PropertiesDashboard() {
  const [, navigate] = useLocation();
  const { properties, setSelectedProperty } = useAppState();
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    navigate(`/property/${property.id}`);
  };
  
  const qualifiedCount = properties.filter(p => p.qualificationStatus !== 'not_qualified').length;
  
  return (
    <AppLayout>
      <div className="safe-area-top px-5 pt-4 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">عقاراتي</h1>
          <p className="text-muted-foreground">
            {properties.length} عقار مسجل • {qualifiedCount} مؤهل للتمويل
          </p>
        </motion.div>
        
        {/* Properties list */}
        <div className="space-y-4">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handlePropertyClick(property)}
              className="card-floating cursor-pointer active:scale-[0.98] transition-transform"
            >
              {/* Property image */}
              <div className="relative h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
                <img
                  src={property.imageUrl || '/images/property-illustration.png'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {/* Qualification badge */}
                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium border ${getQualificationStyle(property.qualificationStatus)}`}>
                  <div className="flex items-center gap-1.5">
                    {property.qualificationStatus === 'not_qualified' ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{getQualificationLabel(property.qualificationStatus)}</span>
                  </div>
                </div>
              </div>
              
              {/* Property info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground">{property.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{property.type}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground mt-1" />
              </div>
              
              {/* Eligible amount (only for qualified properties) */}
              {property.qualificationStatus !== 'not_qualified' && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">مبلغ التمويل المؤهل</p>
                  <p className="text-xl font-bold text-primary">
                    <span className="currency-sar">{formatCurrency(property.eligibleAmount)}</span>
                    <span className="text-sm font-normal text-muted-foreground mr-1">ر.س</span>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Empty state */}
        {properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              لا توجد عقارات مسجلة
            </h3>
            <p className="text-muted-foreground text-sm">
              لم يتم العثور على عقارات مسجلة باسمك في ناجز
            </p>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
