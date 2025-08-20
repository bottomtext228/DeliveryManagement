using backend.Dtos.Order;
using backend.Models.Map;

namespace backend.Interfaces.Services
{
    public interface IMapService
    {
        IEnumerable<Town> GetTowns();
        int[][] GetRoads();
        Task<Result<ComputeRouteResponseDto>> ComputeRouteAsync(ComputeRouteRequestDto model);
    }
}