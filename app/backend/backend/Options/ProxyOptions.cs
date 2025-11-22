using System.ComponentModel.DataAnnotations;

namespace backend.Options
{
    public class ProxyOptions
    {  
        [Required]
        public string[] KnownProxies { get; set; } = [];

        [Required]
        public int ForwardLimit { get; set; }
    }
}