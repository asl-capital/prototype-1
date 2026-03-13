import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, MapPin, Ruler, FileText, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState, Property } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Property Details
 * - Full property information
 * - "استخدام هذا العقار كضمان" CTA
 * - "طلب إعادة تقييم" option
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

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
      return 'bg-green-50 text-green-700';
    case 'qualified_48h':
      return 'bg-amber-50 text-amber-700';
    case 'not_qualified':
      return 'bg-red-50 text-red-700';
  }
};

export default function PropertyDetails() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const { properties, selectedProperty, setSelectedProperty } = useAppState();
  
  // Get property from state or find by ID
  const property = selectedProperty || properties.find(p => p.id === params.id);
  
  if (!property) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">العقار غير موجود</p>
        </div>
      </AppLayout>
    );
  }
  
  const handleBack = () => {
    setSelectedProperty(null);
    navigate('/properties');
  };
  
  const handleUseAsCollateral = () => {
    navigate(`/loan-design/${property.id}`);
  };
  
  const handleRequestRevaluation = () => {
    navigate(`/revaluation/${property.id}`);
  };
  
  const isQualified = property.qualificationStatus !== 'not_qualified';
  
  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero image */}
        <div className="relative h-56">
          <img
            src={property.imageUrl || '/images/property-illustration.png'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {/* Back button */}
          <button
            onClick={handleBack}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg safe-area-top"
          >
            <ArrowRight className="w-5 h-5 text-foreground" />
          </button>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        {/* Content */}
        <div className="px-5 -mt-8 relative z-10 pb-32">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-floating mb-4"
          >
            {/* Qualification badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${getQualificationStyle(property.qualificationStatus)}`}>
              {property.qualificationStatus === 'not_qualified' ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span>{getQualificationLabel(property.qualificationStatus)}</span>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-foreground mb-2">{property.title}</h1>
            <p className="text-muted-foreground mb-4">{property.type}</p>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
            
            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Ruler className="w-4 h-4" />
                  <span className="text-sm">المساحة</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {property.area} م²
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">رقم الصك</span>
                </div>
                <p className="text-lg font-semibold text-foreground" dir="ltr">
                  {property.deedNumber}
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Valuation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-floating mb-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">القيمة التقديرية</p>
                <p className="text-2xl font-bold text-foreground">
                  <span className="currency-sar">{formatCurrency(property.estimatedValue)}</span>
                  <span className="text-sm font-normal text-muted-foreground mr-1">ر.س</span>
                </p>
              </div>
              <button
                onClick={handleRequestRevaluation}
                className="flex items-center gap-2 text-primary text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>طلب إعادة تقييم</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 bg-muted/50 rounded-lg p-3">
              * إعادة التقييم خدمة مدفوعة تتم عبر مقيّم معتمد
            </p>
          </motion.div>
          
          {/* Eligible amount card (only for qualified) */}
          {isQualified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-floating bg-primary/5 border border-primary/20"
            >
              <p className="text-sm text-primary mb-1">مبلغ التمويل المؤهل</p>
              <p className="text-3xl font-bold text-primary">
                <span className="currency-sar">{formatCurrency(property.eligibleAmount)}</span>
                <span className="text-sm font-normal text-primary/70 mr-1">ر.س</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                يمثل 70% من القيمة التقديرية للعقار
              </p>
            </motion.div>
          )}
          
          {/* Not qualified message */}
          {!isQualified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-floating bg-red-50 border border-red-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800 mb-1">هذا العقار غير مؤهل للتمويل</p>
                  <p className="text-sm text-red-700">
                    قد يكون السبب: نوع العقار، موقعه، أو وجود رهن سابق. يمكنك طلب إعادة تقييم أو التواصل مع الدعم.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Fixed bottom CTAs */}
        <div className="fixed bottom-20 left-0 right-0 bg-background border-t border-border p-5" style={{ maxWidth: '430px', margin: '0 auto' }}>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="btn-secondary flex-1"
            >
              رجوع
            </button>
            {isQualified && (
              <button
                onClick={handleUseAsCollateral}
                className="btn-primary flex-1"
              >
                استخدام هذا العقار كضمان
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
