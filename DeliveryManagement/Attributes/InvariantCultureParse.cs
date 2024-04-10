using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace DeliveryManagement.Attributes
{
    public class InvariantCultureParse : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value != null && value.GetType() == typeof(string))
            {              
                float result;
                return float.TryParse((string)value, CultureInfo.InvariantCulture, out result);    
            }
            return false;
        }
    }
}
